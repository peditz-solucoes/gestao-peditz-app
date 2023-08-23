import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../src/renderer/src/assets/peditz.jpeg?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

console.log = log.log
console.error = log.error

autoUpdater.autoDownload = false

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
})

let dialogOpen = 0
autoUpdater.on('update-available', () => {
  console.log('Update available...')
  dialogOpen = dialogOpen + 1

  try {
    if (dialogOpen === 1) {
      dialog
        .showMessageBox({
          type: 'info',
          buttons: ['Baixar', 'Depois'],
          title: 'Atualização encontrada! 😍😍',
          detail: 'Deseja fazer o download dessa atualização?',
          message: 'Atualização encontrada! 😍😍'
        })
        .then((returnValue) => {
          dialogOpen = 0
          if (returnValue.response === 0) {
            autoUpdater.downloadUpdate()
          }
        })
    }
  } catch (error) {}
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    simpleFullscreen: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // mainWindow.webContents.on('before-input-event', (_, input) => {
  //   if (input.key.toLowerCase() === 'f5') {
  //     console.log('F5 pressed. Reloading...')
  //     mainWindow.webContents.reloadIgnoringCache()
  //     app.relaunch()
  //     app.exit()
  //   }
  // })

  autoUpdater.on('download-progress', (a) => {
    try {
      mainWindow.setTitle(`Baixando nova versao ${Math.round(a.percent)}%`)
    } catch (error) {}
    console.log(`Baixando nova versao ${Math.round(a.percent)}%`)
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.setTitle('Peditz Gestão ' + app.getVersion())
    console.log('Downlaod finalizado...')

    try {
      dialog
        .showMessageBox({
          type: 'info',
          buttons: ['Reiniciar', 'Depois'],
          title: 'Atualizaçao',
          detail: 'Uma nova versão foi baixada! Deseja reiniciar o Peditz?',
          message: 'Reinicie! 😍😍'
        })
        .then((returnValue) => {
          dialogOpen = 0
          if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    } catch (error) {
      console.log('Errou ao atualizar', error)
    }
  })

  ipcMain.on('reload-page', () => {
    mainWindow.webContents.reloadIgnoringCache(); // Recarrega a página ignorando o cache
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  autoUpdater.checkForUpdatesAndNotify()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('print-line', (_, line, printerName) => {
  // Criar uma nova janela do Electron para o conteúdo da impressão
  let win = new BrowserWindow({ show: false })
  win.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      ${line}
  `)}`
  )



  // Imprimir quando estiver pronto
  win.webContents.on('did-finish-load', () => {
    win.webContents.print(
      {
        silent: true, // isso mostrará a caixa de diálogo de impressão
        printBackground: true,
        deviceName: printerName // se você souber o nome da impressora, pode definir aqui
      },
      (success, reason) => {
        if (!success) {
          console.log(`Falha na impressão: ${reason}`)
        }

        // Fechar a janela após a impressão
        win.close()
      }
    )
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  console.log('App ready')
  autoUpdater.checkForUpdatesAndNotify()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
