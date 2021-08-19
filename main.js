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

  mainWindow.loadFile('./windows/index.html')

  if (!isProd) mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send('posts', posts)
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
        },
        title: 'Create a new post',
      })

      modalWindow.loadFile('./windows/post-modal.html')

      modalWindow.on('ready-to-show', () => modalWindow.show())

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


app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
