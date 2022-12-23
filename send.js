var os = require('os') // For getting IP
const fs = require("fs")
const net = require("net")
const {
    ipcRenderer
} = require('electron');

function sendFile(file = "./sender/op.png") {
    isSending()
    let server, istream = fs.createReadStream(file);

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
            sendFile(file)
        })
        socket.on('error', function (error) {
            console.log("Error: ", error)
            ipcRenderer.send('open-error-dialog', error.message);
        });
        socket.on("end", () => {
            isNotSending()
            ipcRenderer.send('open-msg-dialog', "File Sent.");
            server.close(() => {
                console.log("\nTransfer is done!")
            });
        })
    })

    server.listen(8000, '192.168.0.107');
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
if(address[0]) {
    ip_el.innerText = address[0]
}
//  ------------------------------- Getting IP ------------------------------