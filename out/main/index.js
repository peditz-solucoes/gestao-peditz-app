"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const electronUpdater = require("electron-updater");
const log = require("electron-log");
const icon = path.join(__dirname, "./chunks/peditz-b44a92a1.jpeg");
electronUpdater.autoUpdater.logger = log;
electronUpdater.autoUpdater.logger.info("App starting...");
function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send("message", text);
}
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    simpleFullscreen: true,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electronUpdater.autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
  sendStatusToWindow("Checking for update...");
});
electronUpdater.autoUpdater.on("update-available", () => {
  console.log("Update available.");
  sendStatusToWindow("Update available.");
});
electronUpdater.autoUpdater.on("update-not-available", () => {
  console.log("Update not available.");
  sendStatusToWindow("Update not available.");
});
electronUpdater.autoUpdater.on("error", (err) => {
  console.error("Error in auto-updater. " + err);
  sendStatusToWindow("Error in auto-updater. " + err);
});
electronUpdater.autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  sendStatusToWindow(log_message);
});
electronUpdater.autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded");
  sendStatusToWindow("Update downloaded");
});
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.ipcMain.on("print-line", (_, line, printerName) => {
  let win = new electron.BrowserWindow({ show: false });
  win.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      ${line}
  `)}`
  );
  win.webContents.on("did-finish-load", () => {
    win.webContents.print(
      {
        silent: true,
        // isso mostrará a caixa de diálogo de impressão
        printBackground: true,
        deviceName: printerName
        // se você souber o nome da impressora, pode definir aqui
      },
      (success, reason) => {
        if (!success) {
          console.log(`Falha na impressão: ${reason}`);
        }
        win.close();
      }
    );
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("ready", function() {
  console.log("App ready");
  electronUpdater.autoUpdater.checkForUpdatesAndNotify();
});
