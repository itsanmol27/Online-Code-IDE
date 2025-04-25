import http from "http"
import express from "express"
import { Server as SocketServer } from "socket.io"
import pty from "node-pty"
import generateFileTree from "./utils/generateFileTree.js";
import cors from "cors"
import chokidar from "chokidar"

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(express.json());
app.use(cors());

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

chokidar.watch("./user").on('all', (event , path) => {
    console.log(event, path);
    io.emit("file:changed", path);
})

io.on("connection", (socket) => {
    console.log("Client connected " + socket.id)

    ptyProcess.write("\r");

    socket.on("terminal:input", (data) => {
        ptyProcess.write(`${data}`);
    })

})

app.post("/files", async (req, res) => {
    const { directory } = req.body;
    const files = await generateFileTree(directory);
    return res.json(files);
})

server.listen(4000, () => {
    console.log("Server Started")
})