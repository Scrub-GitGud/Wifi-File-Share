const fs = require("fs")
const net = require("net")

const {
    ipcRenderer
} = require('electron');

let Data = {
    message: "Hi",
    someData: "Let's go"
};

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
        })
        socket.on("end", () => {
            isNotSending()
            server.close(() => {
                console.log("\nTransfer is done!")
            });
        })
    })

    server.listen(8000, '192.168.0.107');
}


const sendBtn = document.getElementById("send")

sendBtn.addEventListener("click", function (event) {
    sendFile()
    // ipcRenderer.send('request-mainprocess-action', Data);
})


function isSending() {
    sendBtn.style.display = 'none'
}

function isNotSending() {
    sendBtn.style.display = 'inline-block'
}




function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let send_file = files[0];

    let reader = new FileReader();
    
    console.log(send_file.name)
    console.log(send_file.path)
    sendFile(send_file.path)

}

document.getElementById('send_file').addEventListener('change', handleFileSelect, false);