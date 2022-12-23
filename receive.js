const net = require("net")
const fs = require("fs")
const {
    ipcRenderer
} = require('electron');

let socket;

function receiveFile(ip = '192.168.0.107') {
    socket = net.connect(8000, ip)

    let ostream = fs.createWriteStream("./file.png");
    let date = new Date()
    let size = 0
    let elapsed

    socket.on('error', function (error) {
        console.log("Error: ", error)
        ipcRenderer.send('open-error-dialog', error.message);
    });


    socket.on('data', chunk => {
        size += chunk.length;
        elapsed = new Date() - date;
        socket.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`)
        process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`);
        ostream.write(chunk);

    });
    socket.on("end", () => {
        console.log(`\nFinished getting file. speed was: ${((size / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
        process.exit();
    });

}



const receiveBtn = document.getElementById("receive")
const ipInput = document.getElementById("ip")


receiveBtn.addEventListener("click", function (event) {
    if (ipInput.value == '' || ipInput.value == null) {
        ipcRenderer.send('open-error-dialog', "Please enter the ip address");
    } else {
        receiveFile(ipInput.value)
    }
})