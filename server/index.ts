import { randomInt } from "crypto";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

type ChatRoom = {
    id?: number,
    name?: string,
    password?: string,
    numPeople: number,
    hasPassword?: boolean,
    public?: boolean,
    joinCode?: string,
}


type ChatMessage = {
    username?: string,
    message?: string,
}

export type PrivateMessage = {
    socketId?: string,
    content?: ChatMessage,
}

export type User = {
    username?: string,
    socketId?: string,
}


const port = 3000;
const httpServer = createServer();

let rooms = [] as ChatRoom[];
let users = new Map<string, User>();
let joinCodes = [] as number[];

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
        users.set(socket.id, { socketId: socket.id, username: data.username })
        console.log(`${data.username} joined`)

        const usernames = [...users.values()]
        io.emit('all users', usernames);
    })

    socket.on('get users', () => {
        console.log(`${socket.id} asked for online users`)
        socket.emit('all users', getUsers(users));
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
        io.emit('all users', getUsers(users));
    })

    //chat
    //join room
    socket.on('join room', (data: ChatRoom) => {
        console.log(`${socket.id} tried to join: ${data.id}`)
        if (data.id !== undefined && data.id !== connectedRoomId) {
            if (connectedRoomId !== -1) {
                socket.leave(connectedRoomId.toString());
                rooms[connectedRoomId].numPeople--;
                connectedRoomId = -1;
            }

            if (!rooms[data.id].hasPassword || (rooms[data.id].password === data.password)) {
                rooms[data.id].numPeople++;

                let joinedRoom: ChatRoom = rooms[data.id];
                joinedRoom.id = data.id;
                socket.emit('joined room', joinedRoom);
                socket.join(data.id.toString());

                connectedRoomId = data.id;
                console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`);
                console.log(connectedRoomId)

                io.emit('all rooms', getRoomView(rooms));
            }
        }
    })

    //join a room with a code
    socket.on('join private room', (data) => {
        console.log(`${socket.id} tried to join private room:`)
        if (!data.code) {
            return;
        }
        const roomIndex = rooms.findIndex((r) => r.joinCode === data.code)
        if (roomIndex === -1) {
            return;
        }
        if (roomIndex === connectedRoomId) {
            return;
        }

        if (connectedRoomId !== -1) {
            socket.leave(connectedRoomId.toString());
            rooms[connectedRoomId].numPeople--;
            connectedRoomId = -1;
            io.emit('all rooms', getRoomView(rooms));
        }

        rooms[roomIndex].numPeople++;
        let joinedRoom: ChatRoom = rooms[roomIndex];
        socket.emit('joined room', joinedRoom);
        socket.join(roomIndex.toString());

        connectedRoomId = roomIndex;
        console.log(`${socket.id} joined to private room ${roomIndex} - ${rooms[roomIndex].name}`)
        console.log(connectedRoomId);
    })

    //leave room
    socket.on('leave', () => {
        if (connectedRoomId !== -1) {
            socket.leave(connectedRoomId.toString());

            rooms[connectedRoomId].numPeople--;
            connectedRoomId = -1;

            socket.emit('left room');
            io.emit('all rooms', getRoomView(rooms));
        }
    })

    //receive message
    socket.on('new message', (data) => {
        if (connectedRoomId !== -1) {
            console.log(`${socket.id}: ${data} - ${connectedRoomId}`);
            let msg = { username: socket.id, message: data }
            console.log(`broadcast to ${connectedRoomId} - ${rooms[connectedRoomId].joinCode}`)
            io.to(connectedRoomId.toString()).emit('new message', msg);
        }
    })

    //private message
    socket.on('private message', (pm: PrivateMessage) => {
        if (pm.socketId) {
            //add username

            //socket.to(pm.socketId).emit('private message', pm);
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
        let hasPwd = false;
        if (data.password) {
            hasPwd = true;
        }

        rooms.push({ id: rooms.length, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd });
        console.log(`added new room: ${data.name} ${data.password}`);

        io.emit('new room');
    })


    socket.on('new private room', (data: ChatRoom) => {
        let code = randomInt(1000, 10000);
        if (joinCodes.findIndex((i) => i === code) !== -1) {
            console.log("code exists")
            return;
        }

        console.log(code)
        joinCodes.push(code);
        rooms.push({ id: rooms.length, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() })
        socket.emit('private room code', (code))
    })

})

httpServer.listen(port);
console.log(`Listening on port ${port}`);

function getRoomView(_rooms: ChatRoom[]) {
    return _rooms.filter((r) => { return r.public }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }));
}

function getUsers(_users: Map<string, User>) {
    return [..._users.values()]
}
