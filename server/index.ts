import { createServer } from "http";
import { Server, Socket } from "socket.io";

const port = 4200;

const httpServer = createServer();


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
    }
})

io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    socket.on('join', (data) => {
        socket.emit('joined');
    })

    socket.on('new message', (data) => {
        let msg = socket.id + ": "  + data;
        console.log(`${socket.id}: ${data}`);

        io.emit('new message', msg);
    })
})

httpServer.listen(port);
console.log(`Listening on port ${port}`);
