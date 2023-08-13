"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/peditz.jpeg");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
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
electron.ipcMain.on("print-line", (_, line) => {
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
        deviceName: "MP-4200 TH"
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
