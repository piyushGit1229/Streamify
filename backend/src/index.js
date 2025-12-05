import dotenv from 'dotenv';
import app from './app.js';
import connectToDB from './config/dbConnect.js';
import { initSocket } from './config/socket.js';

import http from "http";
import { Server } from "socket.io";

dotenv.config();

connectToDB();

const server = http.createServer(app);

//socket server
initSocket(server);

// const io = new Server(server, {
//     cors: {
//         // origin: "http://localhost:5173",
//         origin: "*",
//         methods: ["GET", "POST"],
//         credentials: true,
//     },
// });

// io.on("connection", (socket) => {
//     console.log("🟢 Socket connected:", socket.id);

//     socket.on("disconnect", () => {
//         console.log("🔴 Socket disconnected:", socket.id);
//     });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
