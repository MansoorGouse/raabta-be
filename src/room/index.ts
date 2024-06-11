import  {Socket} from "socket.io"
import {v4 as uuidV4} from "uuid";

const rooms : Record<string,string[]>={};

interface IRoomParams {
    roomId: string;
    peerId: string;
}

export const roomHandler = (socket: Socket) =>{

    const createRoom = ()=>{
        const roomId= uuidV4();
        rooms[roomId]=[];
        socket.emit("room-created",{roomId})
        console.log(`User Created the Room ${roomId}`)
    }
    const leaveRoom = ({roomId,peerId}:IRoomParams)=>{
        if(rooms[roomId])rooms[roomId] = rooms[roomId].filter( (id) => id !== peerId)
        socket.to(roomId).emit("user-disconnected",{peerId});
        console.log("user disconnected the room",peerId);
    }
    const joinRoom = ({roomId,peerId}:IRoomParams)=>{
        if(rooms[roomId]){
            socket.join(roomId)
            rooms[roomId].push(peerId);
            socket.to(roomId).emit("user-joined",{peerId})
            console.log(rooms[roomId])
            socket.emit("get-users",{particpants:rooms[roomId]})
            console.log("User Joined the Room",roomId,peerId);
        }
        socket.on("disconnect",()=>{
            console.log("user left the room",peerId);
            leaveRoom({roomId,peerId})
        })
    }
    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}