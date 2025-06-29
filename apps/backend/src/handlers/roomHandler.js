"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");

var rooms = {};
var roomHandler = function (socket) {
    var currentRoom = null;
    var currentPeerId = null;
    var createRoom = function () {
        var roomId = (0, uuid_1.v4)();
        socket.join(roomId);
        rooms[roomId] = [];
        currentRoom = roomId;
        socket.emit('room-created', { roomId: roomId });
        console.log('room created with id ', roomId);
    };
    var joinedRoom = function (_a) {
        var roomId = _a.roomId, peerId = _a.peerId;
        if (rooms[roomId]) {
            console.log("new user has joined room ", roomId, "with peer id as", peerId);
            
            rooms[roomId].push({
                peerId: peerId,
                socketId: socket.id,
                username: undefined
            });
            socket.join(roomId);
            currentRoom = roomId;
            currentPeerId = peerId;
            socket.on("ready", function () {
           
                var existingUsers = rooms[roomId]
                    .filter(function (user) { return user.peerId !== peerId; })
                    .map(function (user) { return ({
                    peerId: user.peerId,
                    username: user.username
                }); });
                socket.emit('existing-users', existingUsers);
               
                socket.to(roomId).emit('user-joined', { peerId: peerId });
            });
        }
    };
    var handleUsername = function (_a) {
        var peerId = _a.peerId, username = _a.username;
        console.log("Username received: peerId=".concat(peerId, ", username=").concat(username, ", room=").concat(currentRoom));
        if (currentRoom && rooms[currentRoom]) {
      
            var peer = rooms[currentRoom].find(function (p) { return p.peerId === peerId; });
            if (peer) {
                peer.username = username;
                console.log("Updated username for peer ".concat(peerId, ": ").concat(username));
               
                socket.to(currentRoom).emit('peer-username', { peerId: peerId, username: username });
                console.log("Broadcasting username to room ".concat(currentRoom));
            }
            else {
                console.log("Peer ".concat(peerId, " not found in room ").concat(currentRoom));
            }
        }
    };
    var handleVideoToggle = function (_a) {
        var peerId = _a.peerId, isVideoOff = _a.isVideoOff;
        console.log("Video toggle received: peerId=".concat(peerId, ", isVideoOff=").concat(isVideoOff, ", room=").concat(currentRoom));
        if (currentRoom) {
            socket.to(currentRoom).emit('video-toggle', { peerId: peerId, isVideoOff: isVideoOff });
            console.log("Broadcasting video toggle to room ".concat(currentRoom));
        }
    };
    var handleDisconnect = function () {
        if (currentRoom && rooms[currentRoom] && currentPeerId) {
            console.log("User disconnecting: peerId=".concat(currentPeerId, ", room=").concat(currentRoom));
   
            rooms[currentRoom] = rooms[currentRoom].filter(function (user) { return user.peerId !== currentPeerId; });
     
            socket.to(currentRoom).emit('user-left', { peerId: currentPeerId });
            console.log("User ".concat(currentPeerId, " disconnected from room ").concat(currentRoom));
        }
    };
  
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
    socket.on("username", handleUsername);
    socket.on("video-toggle", handleVideoToggle);
    socket.on("disconnect", handleDisconnect);
};
exports.default = roomHandler;
