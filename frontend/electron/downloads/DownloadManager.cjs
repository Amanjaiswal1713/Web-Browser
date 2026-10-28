const { app, shell } = require("electron");

const fs = require("node:fs");
const path = require("node:path");

class DownloadManager {
  constructor(getMainWindow) {
    this.getMainWindow = getMainWindow;

    this.activeDownloads = new Map();

    this.registeredSessions = new WeakSet();
  }

  generateDownloadId() {
    const randomPart = Math.random().toString(36).slice(2, 8);

    return `download-${Date.now()}-${randomPart}`;
  }

  calculateProgress(receivedBytes, totalBytes) {
    if (!Number.isFinite(totalBytes) || totalBytes <= 0) {
      return 0;
    }

    const progress = Math.round((receivedBytes / totalBytes) * 100);

    return Math.min(100, Math.max(0, progress));
  }

  getUniqueSavePath(directory, filename) {
    const parsed = path.parse(filename);

    let candidate = path.join(directory, filename);

    let counter = 1;

    while (fs.existsSync(candidate)) {
      const nextFilename = `${parsed.name} (${counter})${parsed.ext}`;

      candidate = path.join(directory, nextFilename);

      counter += 1;
    }

    return candidate;
  }

  registerSession(browserSession) {
    if (!browserSession) {
      return;
    }

    if (this.registeredSessions.has(browserSession)) {
      return;
    }

    this.registeredSessions.add(browserSession);

    browserSession.on("will-download", (event, item, webContents) => {
      this.handleDownload(event, item, webContents);
    });
  }

  handleDownload(event, item, webContents) {
    const downloadId = this.generateDownloadId();

    const originalFilename = item.getFilename();

    const filename =
      originalFilename && originalFilename.trim()
        ? originalFilename.trim()
        : "download";

    const downloadsDirectory = app.getPath("downloads");

    const savePath = this.getUniqueSavePath(downloadsDirectory, filename);

    item.setSavePath(savePath);

    const totalBytes = item.getTotalBytes();

    const receivedBytes = item.getReceivedBytes();

    const sourceUrl =
      webContents && !webContents.isDestroyed() ? webContents.getURL() : "";

    const downloadState = {
      id: downloadId,
      filename,
      url: item.getURL(),
      sourceUrl,
      savePath,

      totalBytes,
      receivedBytes,

      progress: this.calculateProgress(receivedBytes, totalBytes),

      status: "progressing",

      paused: false,

      canResume: item.canResume(),

      startedAt: new Date().toISOString(),

      completedAt: null,
    };

    this.activeDownloads.set(downloadId, {
      item,
      state: downloadState,
    });

    this.sendToRenderer("download:started", downloadState);

    item.on("updated", (updateEvent, state) => {
      const record = this.activeDownloads.get(downloadId);

      if (!record) {
        return;
      }

      const latestReceivedBytes = item.getReceivedBytes();

      const latestTotalBytes = item.getTotalBytes();

      let status = "progressing";

      if (state === "interrupted") {
        status = "interrupted";
      } else if (item.isPaused()) {
        status = "paused";
      }

      record.state = {
        ...record.state,

        receivedBytes: latestReceivedBytes,

        totalBytes: latestTotalBytes,

        progress: this.calculateProgress(latestReceivedBytes, latestTotalBytes),

        status,

        paused: item.isPaused(),

        canResume: item.canResume(),
      };

      this.sendToRenderer("download:updated", record.state);
    });

    item.once("done", (doneEvent, finalState) => {
      const record = this.activeDownloads.get(downloadId);

      if (!record) {
        return;
      }

      const finalReceivedBytes = item.getReceivedBytes();

      const finalTotalBytes = item.getTotalBytes();

      record.state = {
        ...record.state,

        receivedBytes: finalReceivedBytes,

        totalBytes: finalTotalBytes,

        progress:
          finalState === "completed"
            ? 100
            : this.calculateProgress(finalReceivedBytes, finalTotalBytes),

        status: finalState,

        paused: false,
        canResume: false,

        completedAt: new Date().toISOString(),
      };

      this.sendToRenderer("download:finished", record.state);

      this.activeDownloads.delete(downloadId);
    });
  }

  sendToRenderer(channel, payload) {
    const mainWindow = this.getMainWindow();

    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    const renderer = mainWindow.webContents;

    if (!renderer || renderer.isDestroyed()) {
      return;
    }

    renderer.send(channel, payload);
  }

  pause(downloadId) {
    const record = this.activeDownloads.get(downloadId);

    if (!record) {
      return {
        success: false,
        message: "Download is no longer active.",
      };
    }

    if (!record.item.isPaused()) {
      record.item.pause();
    }

    record.state = {
      ...record.state,
      paused: true,
      status: "paused",
      canResume: record.item.canResume(),
    };

    this.sendToRenderer("download:updated", record.state);

    return {
      success: true,
    };
  }

  resume(downloadId) {
    const record = this.activeDownloads.get(downloadId);

    if (!record) {
      return {
        success: false,
        message: "Download is no longer active.",
      };
    }

    if (!record.item.canResume()) {
      return {
        success: false,
        message: "This download cannot be resumed.",
      };
    }

    record.item.resume();

    record.state = {
      ...record.state,
      paused: false,
      status: "progressing",
      canResume: record.item.canResume(),
    };

    this.sendToRenderer("download:updated", record.state);

    return {
      success: true,
    };
  }

  cancel(downloadId) {
    const record = this.activeDownloads.get(downloadId);

    if (!record) {
      return {
        success: false,
        message: "Download is no longer active.",
      };
    }

    record.item.cancel();

    return {
      success: true,
    };
  }

  async openFile(filePath) {
    if (typeof filePath !== "string" || !fs.existsSync(filePath)) {
      return {
        success: false,
        message: "The downloaded file could not be found.",
      };
    }

    const errorMessage = await shell.openPath(filePath);

    if (errorMessage) {
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
    };
  }

  showInFolder(filePath) {
    if (typeof filePath !== "string" || !fs.existsSync(filePath)) {
      return {
        success: false,
        message: "The downloaded file could not be found.",
      };
    }

    shell.showItemInFolder(filePath);

    return {
      success: true,
    };
  }

  cancelAll() {
    for (const record of this.activeDownloads.values()) {
      try {
        record.item.cancel();
      } catch {
        console.error("Could not cancel download during shutdown.");
      }
    }

    this.activeDownloads.clear();
  }
}

module.exports = DownloadManager;
