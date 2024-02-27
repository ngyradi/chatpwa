import { createServer } from "http";
import { Server, Socket } from "socket.io";

type ChatRoom = {
    id?: number,
    name?: string,
    password?: string,
    numPeople: number,
    public?: boolean,
}


type ChatMessage = {
    username?: string,
    message?: string,
}

export type User = {
    username?: string,
}


const port = 3000;
const httpServer = createServer();

let rooms = [] as ChatRoom[];
let users = new Map<string, User>();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
    }
})

io.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected`);
    let connectedRoomId = -1;


    //join online users
    socket.on('join', (data: User) => {
        users.set(socket.id, { username: data.username })
        console.log(`${data.username} joined`)

        const usernames = [...users.values()]
        io.emit('all users', usernames);
    })

    socket.on('get users', () => {
        console.log(`${socket.id} asked for online users`)
        socket.emit('all users', getUsernames(users));
    })


    socket.on('disconnect', () => {
        console.log("user disconnected");
        users.delete(socket.id);
        if (connectedRoomId !== -1) {
            if (rooms[connectedRoomId]) {
                rooms[connectedRoomId].numPeople--;
                io.emit('all rooms', getRoomView(rooms));
            }
        }
        io.emit('all users', getUsernames(users));
    })

    //chat
    //join room
    socket.on('joinRoom', (data: ChatRoom) => {
        console.log(`${socket.id} tried to join: ${data.id}`)

        if (data.id !== undefined && data.id !== connectedRoomId) {
            if (connectedRoomId !== -1) {
                socket.leave(connectedRoomId.toString());
                rooms[connectedRoomId].numPeople--;
                connectedRoomId = -1;
            }

            if (rooms[data.id].public || (rooms[data.id].password === data.password)) {
                rooms[data.id].numPeople++;

                let joinedRoom: ChatRoom = rooms[data.id];
                joinedRoom.id = data.id;
                socket.emit('joinedRoom', joinedRoom);
                socket.join(data.id.toString());

                connectedRoomId = data.id;
                console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`);
                console.log(connectedRoomId)

                io.emit('all rooms', getRoomView(rooms));
            }
        }
    })

    //leave room
    socket.on('leave', (data: ChatRoom) => {
        if (data.id !== undefined) {
            rooms[data.id].numPeople--;
        }
    })

    //receive message
    socket.on('new message', (data) => {
        if (connectedRoomId !== -1) {
            console.log(`${socket.id}: ${data} - ${connectedRoomId}`);
            let msg = { username: socket.id, message: data }
            console.log(`broadcast to ${connectedRoomId}`)
            io.to(connectedRoomId.toString()).emit('new message', msg);
        }
    })


    //rooms
    //fetch rooms
    socket.on('get rooms', () => {
        console.log(`${socket.id} asked for rooms`)

        socket.emit('all rooms', getRoomView(rooms));
    })

    //create new room
    socket.on('new room', (data: ChatRoom) => {
        let visiblity = true;
        if (data.password) {
            visiblity = false;
        }

        //TODO check if room with same name already exists ?

        rooms.push({ name: data.name, password: data.password, numPeople: 0, public: visiblity });
        console.log(`added new room: ${data.name} ${data.password}`);

        io.emit('new room');
    })

})

httpServer.listen(port);
console.log(`Listening on port ${port}`);

function getRoomView(_rooms: ChatRoom[]) {
    return _rooms.map((r, index) => ({ id: index, name: r.name, numPeople: r.numPeople, public: r.public }));
}

function getUsernames(_users: Map<string, User>) {
    return [..._users.values()]
}
