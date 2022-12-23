const { ipcRenderer } = require('electron');

let Data = {
    message: "Hi",
    someData: "Let's go"
};

const sendBtn = document.getElementById("send")
sendBtn.addEventListener("click", function(event) {
    ipcRenderer.send('request-mainprocess-action', Data);
})
