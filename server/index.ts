import { createServer } from "http";
import { Server, Socket } from "socket.io";

type ChatRoom = {
    name?: string,
    password?: string,
    numPeople?: number,
}


type ChatMessage = {
    username?: string,
    message?: string,
}

const port = 3000;

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


    //join room
    socket.on('join', (data) => {
        socket.emit('joined');
    })

    //receive message
    socket.on('new message', (data) => {
        //let msg = socket.id + ": "  + data;
        console.log(`${socket.id}: ${data}`);

        let msg = {username: socket.id, message: data}

        io.emit('new message', msg);
    })


})

httpServer.listen(port);
console.log(`Listening on port ${port}`);
