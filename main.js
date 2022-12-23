const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron")

let win

function createWindow(htmlFile = 'index.html') {

    if (win) {
        win.close()
    }

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // win.webContents.openDevTools()

    win.loadFile(htmlFile)

    win.on("closed", () => {
        win = null
    })

}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


ipcMain.on('open-send-window', (event, arg) => {
    createWindow('send.html')
});

ipcMain.on('open-receive-window', (event, arg) => {
    createWindow('receive.html')
});

ipcMain.on('open-error-dialog', (event, arg) => {
    dialog.showErrorBox("An error occurred!", arg)
});

ipcMain.on('open-msg-dialog', (event, arg) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Success',
        cancelId: 99,
        message: arg,
    })
});