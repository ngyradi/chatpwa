"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {});
io.on("connection", (socket) => {
    console.log(socket.id);
});
httpServer.listen(3000);
console.log("Listening on port 3000");
