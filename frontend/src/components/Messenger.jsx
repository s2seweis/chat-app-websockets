import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisV, FaSistrix, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
// import ActiveFriend from './ActiveFriend';
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
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

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
  const { myInfo } = useSelector(state => state.auth);

  const [currentfriend, setCurrentFriend] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeUser, setActiveUser] = useState([]);
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
      // if (friends && friends.length > 0) setCurrentFriend(friends[0].fndInfo);
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

  const [buttonText, setButtonText] = useState('Hide Friends');
  const [isActive, setIsActive] = useState(true);
  const handleButtonClick = () => {
    setCurrentFriend('');
    setLeftSideVisibility(!isLeftSideVisible);
  };

  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const currentUserButton = (props) => {
    setCurrentFriend(props.fndInfo);
    setLeftSideVisibility(!isLeftSideVisible);
  };

  const [isLeftSideVisible, setLeftSideVisibility] = useState(true);

  const toggleLeftSideVisibility = () => {
    setLeftSideVisibility(!isLeftSideVisible);
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
      <div className="row">
        <input type="checkbox" id="dot2" />
        <div style={{ width: "fit-content", backgroundColor: "#d9e0e0", position: "fixed", margin: "50px 0% 0px 60%", borderRadius:"15px" }}>
          <div onClick={handleToggleMenu} style={{ margin: "auto" }} className="icon">
            {/* <FaEllipsisV /> */}
          </div>

          {isMenuOpen && (
            <div style={{ margin: "auto", padding:"10px" }} >
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
              <div onClick={handleToggleMenu} className="logout">
                <AiOutlineCloseCircle /> 
              </div>


            </div>
          )}
        </div>
        <div>
          {isLeftSideVisible && (
            <div className="left-side">
              <div className="top">

                <div className="image-name" style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px"}}>
                  <div className="image">
                    <img className='image-me' style={{ height: "50px", width: "50px", borderRadius: "25px", margin:"1px" }} src={`./image/${myInfo.image}`} alt="" />
                  </div>
                  <div className="name">
                    {/* <h3>Welcome</h3> */}
                    <h3 style={{color:"white"}}>{myInfo.userName}</h3>
                  </div>
                  <div style={{width: "50px", color:"white" }} onClick={handleToggleMenu} className="icon">
                    <FaEllipsisV />
                  </div>
                </div>
                <Navbar/>


              </div>
              <div className="friend-search">
                <div style={{marginLeft:"10px", marginBottom:"10px", marginTop:"10px"}} className="search">
                  <button> <FaSistrix /> </button>
                  <input
                    style={{marginLeft:"10px", background:"#e4e4e4", color:"red"}}
                    onChange={search}
                    type="text"
                    placeholder="Search"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="friends">
                {friends && friends.length > 0
                  ? friends.map(fd => (
                    <div
                      onClick={() => {
                        currentUserButton(fd);
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
            </div>
          )}
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
            handleButtonClick={handleButtonClick}
            buttonText={buttonText}
            isActive={isActive}
            handleToggleMenu={handleToggleMenu}
          />
          : <div style={{margin:"25px 25px", textAlign:"center"}}>Please Select your Friend</div> }

      </div>

    </div>
  );
};

export default Messenger;
