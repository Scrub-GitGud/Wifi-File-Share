var os = require('os') // For getting IP
const fs = require("fs")
const net = require("net")
const {
    ipcRenderer
} = require('electron');

// 192.168.48.180
let ip = '192.168.0.107'
let port = 8000

function sendFile(file = "./sender/op.png") {
    isSending()
    let server
    let istream = fs.createReadStream(file)

    server = net.createServer(socket => {
        socket.pipe(process.stdout);
        istream.on("readable", function () {
            let data;
            while (data = this.read()) {
                socket.write(data);
            }
        })
        
        istream.on("end", function () {
            socket.end();
        })
        socket.on("end", () => {
            isNotSending()
            ipcRenderer.send('open-msg-dialog', "File Sent.");
            server.close(() => {
                console.log("\nTransfer is done!")
            });
        })
        socket.on('error', function (error) {
            isNotSending()
            console.log("Error: ", error)
            ipcRenderer.send('open-error-dialog', error.message);
        });
    })

    server.listen(port, ip);
}


const send_file_container = document.getElementById("send_file_container")
const loading = document.getElementById("loading")


function isSending() {
    send_file_container.style.display = 'none'
    loading.style.display = 'flex'
}

function isNotSending() {
    send_file_container.style.display = 'block'
    loading.style.display = 'none'
}




function handleFileSelect(evt) {
    let files = evt.target.files;

    let send_file = files[0];

    let reader = new FileReader();
    
    console.log(send_file.name)
    console.log(send_file.path)
    sendFile(send_file.path)

}

document.getElementById('send_file').addEventListener('change', handleFileSelect, false);



//  ------------------------------- Getting IP ------------------------------
ip_el = document.getElementById("ip")

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
console.log("IP", addresses[0]);
if(addresses[0]) {
    ip = addresses[0]
    ip_el.innerText = addresses[0]
}
//  ------------------------------- Getting IP ------------------------------