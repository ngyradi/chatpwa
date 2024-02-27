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

let rooms: ChatRoom[];

rooms = [];

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
    }
})

io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);

    //chat
    //join room
    socket.on('join', (data) => {
        socket.emit('joined');
    })

    //receive message
    socket.on('new message', (data) => {
        console.log(`${socket.id}: ${data}`);

        let msg = { username: socket.id, message: data }
        io.emit('new message', msg);
    })


    //rooms
    //fetch rooms
    socket.on('get rooms', () =>{
        console.log(`${socket.id} asked for rooms`)

        const roomView: ChatRoom[] = rooms.map(r => ({name: r.name, numPeople: r.numPeople}));

        console.log(roomView);
        socket.emit('all rooms',rooms);
    })

    //create new room
    socket.on('new room', (data : ChatRoom) => {
        rooms.push({name: data.name, password: data.password, numPeople: 0});
        console.log(`added new room: ${data.name} ${data.password}`);

        io.emit('new room');
    })

})

httpServer.listen(port);
console.log(`Listening on port ${port}`);
