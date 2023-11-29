const socketIO = require('socket.io');

let users = [];

function configureSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('Socket is connecting...');

    socket.on('addUser', (userId, userInfo) => {
      addUser(userId, socket.id, userInfo);
      io.emit('getUser', users);

      const otherUsers = users.filter(u => u.userId !== userId);
      const con = 'new_user_add';
      otherUsers.forEach(u => {
        socket.to(u.socketId).emit('new_user_add', con);
      });
    });

    socket.on('sendMessage', data => {
      const user = findFriend(data.reseverId);

      if (user !== undefined) {
        socket.to(user.socketId).emit('getMessage', data);
      }
    });

    socket.on ('messageSeen', msg => {
        const user = findFriend (msg.senderId);
        if (user !== undefined) {
          socket.to (user.socketId).emit ('msgSeenResponse', msg);
        }
      });
    
      socket.on ('delivaredMessage', msg => {
        const user = findFriend (msg.senderId);
        if (user !== undefined) {
          socket.to (user.socketId).emit ('msgDelivaredResponse', msg);
        }
      });
      socket.on ('seen', data => {
        const user = findFriend (data.senderId);
        if (user !== undefined) {
          socket.to (user.socketId).emit ('seenSuccess', data);
        }
      });
    
      socket.on ('typingMessage', data => {
        const user = findFriend (data.reseverId);
        if (user !== undefined) {
          socket.to (user.socketId).emit ('typingMessageGet', {
            senderId: data.senderId,
            reseverId: data.reseverId,
            msg: data.msg,
          });
        }
      });
    
      socket.on ('logout', userId => {
        userLogout (userId);
      });

    socket.on('disconnect', () => {
      console.log('User is disconnecting...');
      userRemove(socket.id);
      io.emit('getUser', users);
    });
  });

  return io;
}

function addUser(userId, socketId, userInfo) {
  const checkUser = users.some(u => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
}

function userRemove(socketId) {
  users = users.filter(u => u.socketId !== socketId);
}

function findFriend(id) {
  return users.find(u => u.userId === id);
}

function userLogout(userId) {
  users = users.filter(u => u.userId !== userId);
}

module.exports = {
  configureSocket,
  addUser,
  userRemove,
  findFriend,
  userLogout,
};
