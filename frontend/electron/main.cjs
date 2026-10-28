const { app, BrowserWindow, dialog, ipcMain, session } = require("electron");
const path = require("node:path");
const TabManager = require("./browser/TabManager.cjs");
const DownloadManager = require("./downloads/DownloadManager.cjs");
const { registerBrowserHandlers } = require("./ipc/browserHandlers.cjs");
const { registerDownloadHandlers } = require("./ipc/downloadHandlers.cjs");
let mainWindow = null;
let tabManager = null;
let downloadManager = null;
let windowHandlersRegistered = false;
let browserHandlersRegistered = false;
let downloadHandlersRegistered = false;
const isDevelopment = process.env.NODE_ENV === "development";
function registerWindowHandlers() {
  if (windowHandlersRegistered) {
    return;
  }

  windowHandlersRegistered = true;
  ipcMain.on("window:minimize", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.minimize();
  });
  ipcMain.on("window:toggle-maximize", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on("window:close", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.close();
  });
  ipcMain.handle("window:is-maximized", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return false;
    }

    return mainWindow.isMaximized();
  });
  ipcMain.handle("window:toggle-fullscreen", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return {
        success: false,
        fullscreen: false,
      };
    }

    const fullscreen = !mainWindow.isFullScreen();

    mainWindow.setFullScreen(fullscreen);

    return {
      success: true,
      fullscreen,
    };
  });
  ipcMain.handle("window:is-fullscreen", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return false;
    }

    return mainWindow.isFullScreen();
  });
  ipcMain.handle("app:get-info", () => {
    return {
      name: app.getName(),

      version: app.getVersion(),

      platform: process.platform,
    };
  });
  ipcMain.handle("window:select-download-folder", async () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return {
        success: false,
      };
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Choose download folder",

      properties: ["openDirectory"],
    });

    if (result.canceled || !result.filePaths?.[0]) {
      return {
        success: false,
        canceled: true,
      };
    }

    return {
      success: true,
      path: result.filePaths[0],
    };
  });
}
function configurePermissions() {
  const defaultSession = session.defaultSession;

  defaultSession.setPermissionRequestHandler(
    (_webContents, _permission, callback) => {
      callback(false);
    },
  );

  defaultSession.setPermissionCheckHandler(() => false);
}
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 930,

    minWidth: 1050,
    minHeight: 700,

    show: false,

    frame: false,

    autoHideMenuBar: true,

    backgroundColor: "#070b1d",

    title: "Safora Browser",

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),

      contextIsolation: true,

      nodeIntegration: false,

      sandbox: true,

      webSecurity: true,

      devTools: isDevelopment,
    },
  });
  tabManager = new TabManager(mainWindow);

  downloadManager = new DownloadManager(() => mainWindow);
  downloadManager.registerSession(session.defaultSession);
  if (!browserHandlersRegistered) {
    registerBrowserHandlers(ipcMain, () => tabManager);

    browserHandlersRegistered = true;
  }
  if (!downloadHandlersRegistered) {
    registerDownloadHandlers(ipcMain, () => downloadManager);

    downloadHandlersRegistered = true;
  }
  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.show();
  });
  mainWindow.on("maximize", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.webContents.send("window:maximized-change", true);
  });

  mainWindow.on("unmaximize", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.webContents.send("window:maximized-change", false);
  });
  mainWindow.on("enter-full-screen", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.webContents.send("window:fullscreen-change", true);
  });

  mainWindow.on("leave-full-screen", () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }

    mainWindow.webContents.send("window:fullscreen-change", false);
  });
  mainWindow.once("close", () => {
    downloadManager?.cancelAll();

    tabManager?.destroy();
  });

  mainWindow.once("closed", () => {
    downloadManager = null;

    tabManager = null;

    mainWindow = null;
  });
}
app.whenReady().then(() => {
  configurePermissions();

  registerWindowHandlers();

  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
