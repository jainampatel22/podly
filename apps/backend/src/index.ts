import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import roomHandler from './handlers/roomHandler'
const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:['https://podler.space','http://localhost:3000'],
        methods:["GET","POST"]
    }
})
io.on("connection",(socket)=>{
    console.log("new user connected")
roomHandler(socket)
    socket.on("disconnect",()=>{
        console.log("user")
    })
}
)
console.log("heyy")
server.listen(8080)