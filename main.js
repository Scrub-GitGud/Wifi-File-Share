const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron")
const path = require("path")
const url = require("url")

const net = require("net")
const fs = require("fs")

function sendFile(file = "./sender/file.pdf") {
    let server, istream = fs.createReadStream(file);

    server = net.createServer(socket => {
        socket.pipe(process.stdout);
        istream.on("readable", function () {
            let data;
            while (data = this.read()) {
                socket.write(data);
            }
        })
    })

    server.listen(8000, '192.168.0.107');
}

let win

function createWindow() {
    
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.webContents.openDevTools()

    win.loadFile('index.html')

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


ipcMain.on('request-mainprocess-action', (event, arg) => {
    console.log(arg);
    sendFile()
});