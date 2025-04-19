import http from "http"
import express from "express"
import { Server as SocketServer } from "socket.io"
import pty from "node-pty"

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const ptyProcess = new pty.spawn("bash", [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD,
    env: process.env
})

io.attach(server);

ptyProcess.onData(data => {
    console.log(data);
    io.emit("terminal:output", data);

})

io.on("connection", (socket) => {
    console.log("Client connected " + socket.id)

    ptyProcess.write("\r");

    socket.on("terminal:input", (data) => {
        ptyProcess.write(`${data}`);
    })

})

server.listen(4000, () => {
    console.log("Server Started")
})