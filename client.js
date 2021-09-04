(function () {
  var socket = io();
  var messages = document.getElementById("messages");
  var form = document.getElementById("form");
  var input = document.getElementById("input");

  var w = window;
  var d = document;
  var p = parseInt,
    dd = d.documentElement,
    db = d.body,
    dc = d.compatMode == "CSS1Compat",
    dx = dc ? dd : db,
    ec = encodeURIComponent;

  w.CHAT = {
    msgObj: d.getElementById("message"),
    username: null,
    userid: null,
    socket: null,
    init: function (username) {
      this.userid = this.genUid();
      this.username = username;
      d.getElementById("showusername").innerHTML = this.username;
      this.socket=io();
      //告诉服务器端有用户登录
      this.socket.emit("login", {
        userid: this.userid,
        username: this.username,
      });

      //监听新用户登录
      this.socket.on("login", function (o) {
        CHAT.updateSysMsg(o, "login");
      });

      //监听用户退出
      this.socket.on("logout", function (o) {
        CHAT.updateSysMsg(o, "logout");
      });
    },
    //更新系统消息，本例中在用户加入、退出的时候调用
    updateSysMsg: function (o, action) {
        //当前在线用户列表
        var onlineUsers = o.onlineUsers;
        //当前在线人数
        var onlineCount = o.onlineCount;
        //新加入用户的信息
        var user = o.user;
  
        //更新在线人数
        d.getElementById("onlinecount").innerHTML =
          "共 " + onlineCount + " 人在线";
  
        //添加系统消息
        var html = "";
        html += user.username;
        html += action == "login" ? " 加入了聊天室" : " 退出了聊天室";
        var section = d.createElement("li");
        section.textContent= html;
        messages.appendChild(section);
        window.scrollTo(0, document.body.scrollHeight);
      },
    genUid: function () {
      return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    },
    logout: function () {
      location.reload();
    },
    usernameSubmit: function () {
      var username = d.getElementById("username").value;
      if (username != "") {
        d.getElementById("username").value = "";
        d.getElementById("loginbox").style.display = "none";
        d.getElementById("chatbox").style.display = "block";
        this.init(username);
      }
      return false;
    },
  };
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
      var obj={
          username:w.CHAT.username,
          content:input.value
      }
      socket.emit("chat message", obj);
      input.value = "";
    }
  });

  socket.on("chat message", function (obj) {
    var item = document.createElement("li");
    var innercontent=obj.username+": "+obj.content;
    item.textContent = innercontent;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
})();
