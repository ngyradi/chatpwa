import { createServer } from "http";
import { Server, Socket } from "socket.io";

type ChatRoom = {
    name: string,
    password: string,
}


type ChatMessage = {
    username: string,
    message: string,
}

const port = 4200;

const httpServer = createServer();

let rooms : ChatRoom[];

rooms = [];

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

    socket.on('create room', (data)=>{
        rooms.push({name: data.name, password: data.password});
        console.log(`create room ${data.name}`);
        io.emit('new room',data);
    })

    socket.on('view rooms', ()=>{
        socket.emit('all rooms', rooms);
    })
})

httpServer.listen(port);
console.log(`Listening on port ${port}`);
