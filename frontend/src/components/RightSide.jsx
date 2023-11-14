import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VscFileSubmodule } from 'react-icons/vsc';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';
import { BsArrowLeftCircle } from 'react-icons/bs';

const RightSide = (props) => {
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

          <div className="row">
            <div className="col-8">
              <div className="message-send-show">
                <div className="header">
                  <div className="image-name">
                    <div className='icons' />
                    <div className="image">
                      <img src={`./image/${currentfriend.image}`} alt="" />
                      {activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id)
                        ? <div className="active-icon" />
                        : ''}
                    </div>
                    <div className="name">
                      <h3>Chat with</h3>
                      <h3>{currentfriend.userName} </h3>
                    </div>
                  </div>

                  <div className="icons">
                    <div style={{ margin: 'auto 20px' }} onClick={handleButtonClick} className='icon'>
                      <BsArrowLeftCircle />
                    </div>
                    <div className="icon">
                      <label > <VscFileSubmodule onClick={handleButtonClick1} /> </label>
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

RightSide.propTypes = {
  currentfriend: PropTypes.object.isRequired,
  inputHendle: PropTypes.func.isRequired,
  newMessage: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
  message: PropTypes.array.isRequired,
  scrollRef: PropTypes.object.isRequired,
  emojiSend: PropTypes.func.isRequired,
  ImageSend: PropTypes.func.isRequired,
  activeUser: PropTypes.array.isRequired,
  typingMessage: PropTypes.string.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

export default RightSide;
