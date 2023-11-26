import React, { useEffect, useState, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from 'react-icons/fa';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { VscFileSubmodule } from 'react-icons/vsc';
import { } from 'react-icons/bs';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';
import Button from 'react-bootstrap/Button';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { FaEllipsisH, FaSistrix, FaSignOutAlt } from 'react-icons/fa';




const RightSide = props => {
  const {
    currentfriend,
    inputHendle,
    newMessage,
    sendMessage,
    message,
    scrollRef,
    emojiSend,
    ImageSend,
    activeUser,
    typingMessage,
    handleButtonClick,
    buttonText,
    isActive,
    handleToggleMenu
  } = props;

  const [isActive1, setIsActive1] = useState(false);


  const handleButtonClick1 = () => {
    // Toggle the isActive state when the button is clicked
    setIsActive1(!isActive1);
  };

  return (
    <div>

      <input type="checkbox" id="dot2" />
      
      <div className="col-9">
        <div className="right-side">
          <input type="checkbox" id="dot" />

          {/* <div className={!isActive ? 'row' : 'row-off'}> */}
          <div className="row">
            <div className="col-8">
              <div className="message-send-show">
                <div className="header">
                  <div className="image-name">

                    <div className='icons'>
                      {/* <div className="icon">
                      <label htmlFor="dot2"> <AiOutlineMenuUnfold /> </label>
                    </div> */}
                    </div>

                    <div className="image">
                      <img src={`./image/${currentfriend.image}`} alt="" />

                      {activeUser &&
                        activeUser.length > 0 &&
                        activeUser.some(u => u.userId === currentfriend._id)
                        ? <div className="active-icon" />
                        : ''}

                    </div>
                    <div className="name">
                      <h3 style={{color:"white"}}>Chat with:</h3>
                      <h3 style={{color:"white"}}>{currentfriend.userName} </h3>

                    </div>






                  </div>

                  <div className="icons">
                    {/* <div className="icon">
                      <FaPhoneAlt />
                    </div> */}

                    {/* <div className="icon">
                      <FaVideo />
                    </div> */}

                    {/* <div style={{ margin: "auto 20px" }} onClick={handleToggleMenu} className="icon">
                      <FaEllipsisH />
                    </div> */}

                    <div style={{ margin: "auto 20px" }} onClick={handleButtonClick} className="icon">
                      <BsArrowLeftCircle />
                    </div>

                    <div className="icon">
                      <label > <VscFileSubmodule onClick={handleButtonClick1} /> </label>
                    </div>
                    {/* <div className="icon">
                      <label htmlFor="dot2"> <FaRocketchat /> </label>
                    </div> */}

                  </div>
                </div>

                <Message
                  message={message}
                  currentfriend={currentfriend}
                  scrollRef={scrollRef}
                  typingMessage={typingMessage}
                />

                <MessageSend
                  inputHendle={inputHendle}
                  newMessage={newMessage}
                  sendMessage={sendMessage}
                  emojiSend={emojiSend}
                  ImageSend={ImageSend}
                />

              </div>


              <div style={{ display: '' }} className={isActive1 ? 'div-3' : 'div-3-off'}>

              <div className="media">
              <FriendInfo
                message={message}
                currentfriend={currentfriend}
                activeUser={activeUser}
                handleButtonClick1={handleButtonClick1}
              />
            </div>

              </div>


            </div>

            {/* <div className="col-4">
              <FriendInfo
                message={message}
                currentfriend={currentfriend}
                activeUser={activeUser}
              />
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
