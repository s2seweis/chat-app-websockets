import React from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from 'react-icons/fa';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';
import { Link } from 'react-router-dom';


const Guardian = () => {
    //   const {
    //     currentfriend,
    //     inputHendle,
    //     newMessage,
    //     sendMessage,
    //     message,
    //     scrollRef,
    //     emojiSend,
    //     ImageSend,
    //     activeUser,
    //     typingMessage,
    //   } = props;

    return (
        <div style={{
            // backgroundColor: "red", 
            // height: "100vh" 
        }}>

            <div style={{ margin: "15px 0px 0px 15px", display: "flex" }}>
                <button className="btn1">
                    <Link to="/">Go Back</Link>
                </button>
            </div>

            <h1>Test</h1>

        </div>
    );
};

export default Guardian;
