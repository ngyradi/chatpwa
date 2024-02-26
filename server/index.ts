import { createServer } from "http";
import {Server, Socket} from "socket.io";

const port = 4200;

const httpServer = createServer();


const io = new Server(httpServer, {
    cors:{
        origin: "http://localhost:4200",
    }
})

io.on("connection", (socket:Socket) =>{
    console.log(socket.id);
    socket.on('new message', (data)=>{
        console.log("received message " + data);
        /*socket.broadcast.emit('new message', {
            data
        });*/
        io.emit('new message',data);
    })
})

httpServer.listen(port);
console.log(`Listening on port ${port}`);
