const express = require('express');
const app = express();
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const session = require('express-session');

dotenv.config({
  path: 'config/config.env',
});

const databaseConnect = require('./config/database');
const authRouter = require('./routes/authRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const messengerRoute = require('./routes/messengerRoute');

// Set up middleware
app.use(cors());

app.use(
  session({
    secret: '123456789',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none', // 'none' for cross-domain cookies
      secure: true, // must be true if sameSite='none'
    },
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRoute);

// Express routes
app.get('/', (req, res) => {
  res.send('This is from the backend server');
});

// Database connection
databaseConnect();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO instance attached to the same server
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO event handlers
let users = [];

const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((u) => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};

const userRemove = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.find((u) => u.userId === id);
};

const userLogout = (userId) => {
  users = users.filter((u) => u.userId !== userId);
};

io.on('connection', (socket) => {
  console.log('Socket is connecting...');
  socket.on('addUser', (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit('getUser', users);

    const us = users.filter((u) => u.userId !== userId);
    const con = 'new_user_add';
    for (var i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit('new_user_add', con);
    }
  });
  socket.on('sendMessage', (data) => {
    const user = findFriend(data.reseverId);

    if (user !== undefined) {
      socket.to(user.socketId).emit('getMessage', data);
    }
  });

  socket.on('messageSeen', (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgSeenResponse', msg);
    }
  });

  socket.on('deliveredMessage', (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgDeliveredResponse', msg);
    }
  });
  socket.on('seen', (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('seenSuccess', data);
    }
  });

  socket.on('typingMessage', (data) => {
    const user = findFriend(data.reseverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('typingMessageGet', {
        senderId: data.senderId,
        reseverId: data.reseverId,
        msg: data.msg,
      });
    }
  });

  socket.on('logout', (userId) => {
    userLogout(userId);
  });

  socket.on('disconnect', () => {
    console.log('user is disconnect... ');
    userRemove(socket.id);
    io.emit('getUser', users);
  });
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
