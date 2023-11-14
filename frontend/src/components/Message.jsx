import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FaRegCheckCircle } from 'react-icons/fa';

const Message = ({ message, currentfriend, scrollRef, typingMessage }) => {
  const { myInfo } = useSelector(state => state.auth);

  return (
    <>
      <div className='message-show'>
        {message && message.length > 0 ? (
          message.map((m, index) =>
            m.senderId === myInfo.id ? (
              <div key={index} ref={scrollRef} className='my-message'>
                <div className='image-message'>
                  <div className='my-text'>
                    <p className='message-text'>
                      {m.message.text === '' ? (
                        <img src={`./image/${m.message.image}`} alt='' />
                      ) : (
                        m.message.text
                      )}
                    </p>

                    {index === message.length - 1 && m.senderId === myInfo.id ? (
                      m.status === 'seen' ? (
                        <img className='img' src={`./image/${currentfriend.image}`} alt='' />
                      ) : m.status === 'delivered' ? (
                        <span> <FaRegCheckCircle /> </span>
                      ) : (
                        <span> <FaRegCheckCircle /> </span>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div style={{ color: 'blue' }} className='time'>
                  {moment(m.createdAt).startOf('mini').fromNow()}
                </div>
              </div>
            ) : (
              <div key={index} ref={scrollRef} className='fd-message'>
                <div className='image-message-time'>
                  <img src={`./image/${currentfriend.image}`} alt='' />
                  <div className='message-time'>
                    <div className='fd-text'>
                      <p className='message-text'>
                        {m.message.text === '' ? (
                          <img src={`./image/${m.message.image}`} alt='' />
                        ) : (
                          m.message.text
                        )}
                      </p>
                    </div>
                    <div style={{ color: 'blue' }} className='time'>
                      {moment(m.createdAt).startOf('mini').fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )
        ) : (
          <div className='friend_connect'>
            <img src={`./image/${currentfriend.image}`} alt='' />
            <h3>{currentfriend.userName} Connecting </h3>
            <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
          </div>
        )}
      </div>
      {typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id ? (
        <div className='typing-message'>
          <div className='fd-message'>
            <div className='image-message-time'>
              <img src={`./image/${currentfriend.image}`} alt='' />
              <div className='message-time'>
                <div className='fd-text'>
                  <p className='time'>Typing Message.... </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

Message.propTypes = {
  message: PropTypes.array.isRequired,
  currentfriend: PropTypes.object.isRequired,
  scrollRef: PropTypes.object.isRequired,
  typingMessage: PropTypes.object,
};

export default Message;
