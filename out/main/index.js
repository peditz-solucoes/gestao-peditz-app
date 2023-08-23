"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const electronUpdater = require("electron-updater");
const log = require("electron-log");
const icon = path.join(__dirname, "./chunks/peditz-b44a92a1.jpeg");
console.log = log.log;
console.error = log.error;
electronUpdater.autoUpdater.autoDownload = false;
electronUpdater.autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});
let dialogOpen = 0;
electronUpdater.autoUpdater.on("update-available", () => {
  console.log("Update available...");
  dialogOpen = dialogOpen + 1;
  try {
    if (dialogOpen === 1) {
      electron.dialog.showMessageBox({
        type: "info",
        buttons: ["Baixar", "Depois"],
        title: "Atualização encontrada! 😍😍",
        detail: "Deseja fazer o download dessa atualização?",
        message: "Atualização encontrada! 😍😍"
      }).then((returnValue) => {
        dialogOpen = 0;
        if (returnValue.response === 0) {
          electronUpdater.autoUpdater.downloadUpdate();
        }
      });
    }
  } catch (error) {
  }
});
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
  electronUpdater.autoUpdater.on("download-progress", (a) => {
    try {
      mainWindow.setTitle(`Baixando nova versao ${Math.round(a.percent)}%`);
    } catch (error) {
    }
    console.log(`Baixando nova versao ${Math.round(a.percent)}%`);
  });
  electronUpdater.autoUpdater.on("update-downloaded", () => {
    mainWindow.setTitle("Peditz Gestão " + electron.app.getVersion());
    console.log("Downlaod finalizado...");
    try {
      electron.dialog.showMessageBox({
        type: "info",
        buttons: ["Reiniciar", "Depois"],
        title: "Atualizaçao",
        detail: "Uma nova versão foi baixada! Deseja reiniciar o Peditz?",
        message: "Reinicie! 😍😍"
      }).then((returnValue) => {
        dialogOpen = 0;
        if (returnValue.response === 0)
          electronUpdater.autoUpdater.quitAndInstall();
      });
    } catch (error) {
      console.log("Errou ao atualizar", error);
    }
  });
  electron.ipcMain.on("reload-page", () => {
    mainWindow.webContents.reloadIgnoringCache();
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electronUpdater.autoUpdater.checkForUpdatesAndNotify();
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
