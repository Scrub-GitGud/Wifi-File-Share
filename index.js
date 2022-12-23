const {
    ipcRenderer
} = require('electron');


const sendBtn = document.getElementById("send")
const receiveBtn = document.getElementById("receive")


sendBtn.addEventListener("click", function (event) {
    ipcRenderer.send('open-send-window');
})


receiveBtn.addEventListener("click", function (event) {
    ipcRenderer.send('open-receive-window');
})