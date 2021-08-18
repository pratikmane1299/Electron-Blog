// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production' ? true : false

let posts = []

try {
  require('electron-reloader')(module)
} catch (_) {}

let modalWindow

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./windows/index.html')

  // Open the DevTools.
  if (!isProd) mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send('posts', posts)
    // console.log(posts)
  })

  ipcMain.on('open-post-form-modal', (event) => {
    if (!modalWindow) {
      modalWindow = new BrowserWindow({
        width:400,
        height: 400,
        parent: mainWindow,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
      })

      modalWindow.loadFile('./windows/post-modal.html')

      modalWindow.on('close', () => {
        modalWindow = null
      })
    }
  })

  ipcMain.on('add-new-post', (event, post) => {
    posts = [post, ...posts]

    mainWindow.webContents.send('posts', posts)
  })

  ipcMain.on('delete-post', (e, post) => {
    posts = posts.filter(p => p.id !== post.id)
    mainWindow.webContents.send('posts', posts)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
