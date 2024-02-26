import { createServer } from "http";
import {Server, Socket} from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {})

io.on("connection", (socket:Socket) =>{
    console.log(socket.id);
})

httpServer.listen(3000);
console.log("Listening on port 3000");
