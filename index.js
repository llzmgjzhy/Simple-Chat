const express = require("express");
const app = express();
const http = require("http");
const path=require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname,'/')))
app.get("/", (req, res) => {
  // res.send('<h1>欢迎来到旭北阳的聊天室</h1>')
  res.sendFile(__dirname + "/index.html");
});

var onlineUsers={};

var onlineCount=0;

io.on("connection", (socket) => {
  console.log("a uer connected");
  //用户登陆事件记录
  socket.on('login',function(obj){
    socket.name=obj.userid;
    if(!onlineUsers.hasOwnProperty(obj.username)){
      onlineUsers[obj.userid]=obj.username;
      //在线人数+1
      onlineCount++;
      io.emit('login',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
      console.log(obj.username+'加入了聊天室');
    }
  })
  //用户退出事件记录
  socket.on("disconnect", () => {
    if(onlineUsers.hasOwnProperty(socket.name)){
      var obj={userid:socket.nmae,username:onlineUsers[socket.name]};
      delete onlineUsers[socket.name];
      onlineCount--;

      io.emit('logout',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
      console.log(obj.username+'退出了聊天室');
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log("message:" + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
