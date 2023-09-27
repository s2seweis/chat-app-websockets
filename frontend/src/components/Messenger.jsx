import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisH, FaEdit, FaSistrix, FaSignOutAlt } from 'react-icons/fa';
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFriends,
  messageSend,
  getMessage,
  ImageMessageSend,
  seenMessage,
  updateMessage,
  getTheme,
  themeSet,
} from '../store/actions/messengerAction';
import { userLogout } from '../store/actions/authAction';

import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';

import image1 from '../../src/image/292653.jpeg';

import { useNavigate } from 'react-router-dom';

const Messenger = () => {
  const [notificationSPlay] = useSound(notificationSound);
  const [sendingSPlay] = useSound(sendingSound);

  const scrollRef = useRef();
  const socket = useRef();

  const {
    friends,
    message,
    mesageSendSuccess,
    message_get_success,
    themeMood,
    new_user_add,
  } = useSelector(state => state.messenger);
  console.log('line:100', friends);
  const { myInfo } = useSelector(state => state.auth);
  console.log('line:200', myInfo.image);

  const [currentfriend, setCurrentFriend] = useState('');
  // ### need to pass down the current id
  console.log("line:1", currentfriend);
  console.log("line:1.1", currentfriend._id);
  const [newMessage, setNewMessage] = useState('');

  const [activeUser, setActiveUser] = useState([]);
  console.log("line:2".activeUser);
  const [socketMessage, setSocketMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');

  useEffect(() => {
    // socket.current = io('ws://localhost:8000');
    socket.current = io('ws://localhost:5000');
    socket.current.on('getMessage', data => {
      setSocketMessage(data);
    });

    socket.current.on('typingMessageGet', data => {
      setTypingMessage(data);
    });

    socket.current.on('msgSeenResponse', msg => {
      dispatch({
        type: 'SEEN_MESSAGE',
        payload: {
          msgInfo: msg,
        },
      });
    });

    socket.current.on('msgDelivaredResponse', msg => {
      dispatch({
        type: 'DELIVARED_MESSAGE',
        payload: {
          msgInfo: msg,
        },
      });
    });

    socket.current.on('seenSuccess', data => {
      dispatch({
        type: 'SEEN_ALL',
        payload: data,
      });
    });
  }, []);

  useEffect(
    () => {
      if (socketMessage && currentfriend) {
        if (
          socketMessage.senderId === currentfriend._id &&
          socketMessage.reseverId === myInfo.id
        ) {
          dispatch({
            type: 'SOCKET_MESSAGE',
            payload: {
              message: socketMessage,
            },
          });
          dispatch(seenMessage(socketMessage));
          socket.current.emit('messageSeen', socketMessage);
          dispatch({
            type: 'UPDATE_FRIEND_MESSAGE',
            payload: {
              msgInfo: socketMessage,
              status: 'seen',
            },
          });
        }
      }
      setSocketMessage('');
    },
    [socketMessage]
  );

  useEffect(() => {
    socket.current.emit('addUser', myInfo.id, myInfo);
  }, []);

  useEffect(() => {
    socket.current.on('getUser', users => {
      const filterUser = users.filter(u => u.userId !== myInfo.id);
      setActiveUser(filterUser);
    });

    socket.current.on('new_user_add', data => {
      dispatch({
        type: 'NEW_USER_ADD',
        payload: {
          new_user_add: data,
        },
      });
    });
  }, []);

  useEffect(
    () => {
      if (
        socketMessage &&
        socketMessage.senderId !== currentfriend._id &&
        socketMessage.reseverId === myInfo.id
      ) {
        notificationSPlay();
        toast.success(`${socketMessage.senderName} Send a New Message`);
        dispatch(updateMessage(socketMessage));
        socket.current.emit('delivaredMessage', socketMessage);
        dispatch({
          type: 'UPDATE_FRIEND_MESSAGE',
          payload: {
            msgInfo: socketMessage,
            status: 'delivared',
          },
        });
      }
    },
    [socketMessage]
  );

  const inputHendle = e => {
    setNewMessage(e.target.value);

    socket.current.emit('typingMessage', {
      senderId: myInfo.id,
      reseverId: currentfriend._id,
      msg: e.target.value,
    });
  };

  const sendMessage = e => {
    e.preventDefault();
    sendingSPlay();
    const data = {
      senderName: myInfo.userName,
      reseverId: currentfriend._id,
      message: newMessage ? newMessage : '❤',
    };

    socket.current.emit('typingMessage', {
      senderId: myInfo.id,
      reseverId: currentfriend._id,
      msg: '',
    });

    dispatch(messageSend(data));
    setNewMessage('');
  };

  useEffect(
    () => {
      if (mesageSendSuccess) {
        socket.current.emit('sendMessage', message[message.length - 1]);
        dispatch({
          type: 'UPDATE_FRIEND_MESSAGE',
          payload: {
            msgInfo: message[message.length - 1],
          },
        });
        dispatch({
          type: 'MESSAGE_SEND_SUCCESS_CLEAR',
        });
      }
    },
    [mesageSendSuccess]
  );

  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(getFriends());
      dispatch({ type: 'NEW_USER_ADD_CLEAR' });
    },
    [new_user_add]
  );

  useEffect(
    () => {
      if (friends && friends.length > 0) setCurrentFriend(friends[0].fndInfo);
    },
    [friends]
  );

  useEffect(
    () => {
      dispatch(getMessage(currentfriend._id));
      if (friends.length > 0) {
      }
    },
    [currentfriend?._id]
  );

  useEffect(
    () => {
      if (message.length > 0) {
        if (
          message[message.length - 1].senderId !== myInfo.id &&
          message[message.length - 1].status !== 'seen'
        ) {
          dispatch({
            type: 'UPDATE',
            payload: {
              id: currentfriend._id,
            },
          });
          socket.current.emit('seen', {
            senderId: currentfriend._id,
            reseverId: myInfo.id,
          });
          dispatch(seenMessage({ _id: message[message.length - 1]._id }));
        }
      }
      dispatch({
        type: 'MESSAGE_GET_SUCCESS_CLEAR',
      });
    },
    [message_get_success]
  );

  useEffect(
    () => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [message]
  );

  const emojiSend = emu => {
    setNewMessage(`${newMessage}` + emu);
    socket.current.emit('typingMessage', {
      senderId: myInfo.id,
      reseverId: currentfriend._id,
      msg: emu,
    });
  };

  const ImageSend = e => {
    if (e.target.files.length !== 0) {
      sendingSPlay();
      const imagename = e.target.files[0].name;
      const newImageName = Date.now() + imagename;

      socket.current.emit('sendMessage', {
        senderId: myInfo.id,
        senderName: myInfo.userName,
        reseverId: currentfriend._id,
        time: new Date(),
        message: {
          text: '',
          image: newImageName,
        },
      });

      const formData = new FormData();

      formData.append('senderName', myInfo.userName);
      formData.append('imageName', newImageName);
      formData.append('reseverId', currentfriend._id);
      formData.append('image', e.target.files[0]);
      dispatch(ImageMessageSend(formData));
    }
  };

  const [hide, setHide] = useState(true);

  const logout = () => {
    dispatch(userLogout());
    socket.current.emit('logout', myInfo.id);
  };

  useEffect(() => {
    dispatch(getTheme());
  }, []);

  const search = e => {
    const getFriendClass = document.getElementsByClassName('hover-friend');
    const frienNameClass = document.getElementsByClassName('Fd_name');
    for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
      let text = frienNameClass[i].innerText.toLowerCase();
      if (text.indexOf(e.target.value.toLowerCase()) > -1) {
        getFriendClass[i].style.display = '';
      } else {
        getFriendClass[i].style.display = 'none';
      }
    }
  };

  const navigate = useNavigate();

  // const function2 = (props) => {
  //   console.log('line:800', props);
  //   // Add your logic for function 2 here
  // };

  const function2 = (props) => {
    console.log('line:800', props);
    console.log('line:801', props._id);
    setCurrentFriend(props._id);
    // navigate(`/guardian/${props._id}`);
    // Add your logic for function 2 here
  };

  return (
    <div className={themeMood === 'dark' ? 'messenger theme' : 'messenger'}>
      <Toaster
        position={'top-right'}
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '18px',
          },
        }}
      />

      {/* <input type="checkbox" id="dot3" /> */}
      <div className="row">

        <input type="checkbox" id="dot2" />
        {/* ### */}

        <div style={{ display: '' }} className="col-3">

      {/* <input type="checkbox" id="dot3" /> */}
      <input type="checkbox" id="dot3" />
          <div className="left-side">

            <div className="top">
              <div className="image-name">
                <div className="image">
                  <img src={`./image/${myInfo.image}`} alt="" />

                </div>
                <div className="name">
                  <h3>{myInfo.userName} </h3>
                </div>
              </div>

              <div className="icons">
                <div onClick={() => setHide(!hide)} className="icon">
                  <FaEllipsisH />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>

                {/* <div className="icons">
                  <label htmlFor="dot2"> <FaEdit /> </label>
                </div> */}

                <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                  <h3>Dark Mode </h3>
                  <div className="on">
                    <label htmlFor="dark">ON</label>
                    <input
                      onChange={e => dispatch(themeSet(e.target.value))}
                      type="radio"
                      value="dark"
                      name="theme"
                      id="dark"
                    />
                  </div>

                  <div className="of">
                    <label htmlFor="white">OFF</label>
                    <input
                      onChange={e => dispatch(themeSet(e.target.value))}
                      type="radio"
                      value="white"
                      name="theme"
                      id="white"
                    />
                  </div>

                  <div onClick={logout} className="logout">
                    <FaSignOutAlt /> Logout
                  </div>

                </div>

              </div>
            </div>

            <div className="friend-search">
              <div className="search">
                <button> <FaSistrix /> </button>
                <input
                  onChange={search}
                  type="text"
                  placeholder="Search"
                  className="form-control"
                />
              </div>
            </div>

               {/* <div className='active-friends'>
     {
        activeUser && activeUser.length > 0 ? activeUser.map(u =>  <ActiveFriend setCurrentFriend = {setCurrentFriend} user={u} />) : ''  
     }
                        
               </div> */}
           
            {/* ### - stays */}
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map(fd => (
                  <div
                    onClick={() => {
                      setCurrentFriend(fd.fndInfo);
                      // function2(fd.fndInfo);
                    }}
                    className={
                      currentfriend._id === fd.fndInfo._id
                        ? 'hover-friend active'
                        : 'hover-friend'
                    }
                  >
                    <Friends
                      activeUser={activeUser}
                      myId={myInfo.id}
                      friend={fd}
                      id={currentfriend._id}
                    />
                  </div>
                ))
                : 'No Friend'}

            </div>
            {/* ### */}

          </div>

        </div>


        {currentfriend
          ? <RightSide
              currentfriend={currentfriend}
              inputHendle={inputHendle}
              newMessage={newMessage}
              sendMessage={sendMessage}
              message={message}
              scrollRef={scrollRef}
              emojiSend={emojiSend}
              ImageSend={ImageSend}
              activeUser={activeUser}
              typingMessage={typingMessage}
            />
          : 'Please Select your Friend'} 

      </div>

    </div>
  );
};

export default Messenger;
