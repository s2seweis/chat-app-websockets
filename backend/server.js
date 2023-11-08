const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users = [];

const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some(u => u.userId === userId);
  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};

const userRemove = (socketId) => {
  users = users.filter(u => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.find(u => u.userId === id);
};

const userLogout = (userId) => {
  users = users.filter(u => u.userId !== userId);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('addUser', (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit('getUser', users);

    const us = users.filter(u => u.userId !== userId);
    const con = 'new_user_add';
    for (var i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit('new_user_add', con);
    }
  });

  // Handle other socket events here...

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    userRemove(socket.id);
    io.emit('getUser', users);
  });
});

const databaseConnect = require('./config/database');
const authRouter = require('./routes/authRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config({
  // path: 'backend/config/config.env'
  path: 'config/config.env',
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRoute);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('This is from backend Sever');
});

databaseConnect();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is on ${PORT} running successfully!`);
});
