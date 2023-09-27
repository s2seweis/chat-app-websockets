import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {FaEllipsisH, FaEdit, FaSistrix, FaSignOutAlt} from 'react-icons/fa';



import { FaRegCheckCircle } from "react-icons/fa";

const Friends = (props) => {
     // console.log("line:700", props);
     const { fndInfo, msgInfo } = props.friend;
     const myId = props.myId;
     const { activeUser } = props;
     const userId = props.id;
     // console.log("line:800", userId);




     return (
          <div className='friend'>
               <div className='friend-image'>
                    <div className='image'>
                         <img src={`./image/${fndInfo.image}`} alt='' />
                         {
                              activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === fndInfo._id) ? <div className='active_icon'></div> : ''
                         }

                    </div>
               </div>

               <div className='friend-name-seen'>
                    <div className='friend-name'>
                         <h4 className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message Fd_name ' : 'Fd_name'} >{fndInfo.userName}</h4>



                         <div className='msg-time'>
                              {
                                   msgInfo && msgInfo.senderId === myId ? <span>You </span> : <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}> {fndInfo.userName + ' '} </span>
                              }
                              {
                                   msgInfo && msgInfo.message.text ? <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}>{msgInfo.message.text.slice(0, 10)}</span> : msgInfo && msgInfo.message.image ? <span>Send A image </span> : <span>Connect You </span>
                              }
                              <span>{msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>

                         </div>
                    </div>

                    {
                         myId === msgInfo?.senderId ?
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo.status === 'seen' ?
                                             <img src={`./image/${fndInfo.image}`} alt='' /> : msgInfo.status === 'delivared' ? <div className='delivared'> <FaRegCheckCircle /> </div> : <div className='unseen'> </div>
                                   }

                              </div> :
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className='seen-icon'> </div> : ''
                                   }


                              </div>
                    }


               </div>

               <div className="mr-4" style={{  }}>
                    <Link 
                    to={`/guardian/${userId}`}
                    >
                         <FaEdit
                              className="mr-3"
                              // style={{ color: "green", cursor: "progress" }}
                         />
                    </Link>


               </div>

          </div>
     )
};

export default Friends;

{/* <div className="mr-4" style={{ display: "flex", justifyContent: "space-around" }}>
<Link to={`/editsetting/${setting._id}`}>
  <EditOutlined
    className="mr-3"
    style={{ color: "green", cursor: "progress" }}
  />
</Link>


</div> */}
