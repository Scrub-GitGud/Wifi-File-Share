const net = require("net")
const fs = require("fs")

let server

let filename = "guts.jpeg"

let istream = fs.createReadStream(`./sender/${filename}`);

server = net.createServer(socket => {
    socket.pipe(process.stdout);

    socket.write(filename);
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
        server.close(() => {
            console.log("\nTransfer is done!")
        });
    })
})

server.listen(8000, '192.168.0.107');