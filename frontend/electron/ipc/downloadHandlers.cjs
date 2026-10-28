function registerDownloadHandlers(ipcMain, getDownloadManager) {
  ipcMain.handle("download:pause", (event, downloadId) => {
    const manager = getDownloadManager();

    if (!manager) {
      return {
        success: false,
        message: "Download manager is unavailable.",
      };
    }

    return manager.pause(downloadId);
  });

  ipcMain.handle("download:resume", (event, downloadId) => {
    const manager = getDownloadManager();

    if (!manager) {
      return {
        success: false,
        message: "Download manager is unavailable.",
      };
    }

    return manager.resume(downloadId);
  });

  ipcMain.handle("download:cancel", (event, downloadId) => {
    const manager = getDownloadManager();

    if (!manager) {
      return {
        success: false,
        message: "Download manager is unavailable.",
      };
    }

    return manager.cancel(downloadId);
  });

  ipcMain.handle("download:open-file", (event, filePath) => {
    const manager = getDownloadManager();

    if (!manager) {
      return {
        success: false,
        message: "Download manager is unavailable.",
      };
    }

    return manager.openFile(filePath);
  });

  ipcMain.handle("download:show-in-folder", (event, filePath) => {
    const manager = getDownloadManager();

    if (!manager) {
      return {
        success: false,
        message: "Download manager is unavailable.",
      };
    }

    return manager.showInFolder(filePath);
  });
}

module.exports = {
  registerDownloadHandlers,
};
