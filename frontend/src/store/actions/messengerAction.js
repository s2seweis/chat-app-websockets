/* eslint-disable */
import axios from 'axios';
import {FRIEND_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,THEME_GET_SUCCESS,THEME_SET_SUCCESS} from "../types/messengerType";

// export const getFriends = () => async(dispatch) => {
//      try{
//           const response = await axios.get('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/get-friends');
//            dispatch({
//                 type: FRIEND_GET_SUCCESS,
//                 payload : {
//                      friends : response.data.friends,
//                 }
//            })

//      }catch (error){
//           console.log("LINE:500",error.response.data);
//      }
// }

export const getFriends = () => async (dispatch) => {
     try {
       const authToken = localStorage.getItem('authToken');
       console.log("line:1200", authToken);
   
       // Check if authToken exists before making the request
       if (!authToken) {
         // Handle the case where there's no authToken (e.g., redirect to login)
         return;
       }
   
       const response = await axios.get('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/get-friends', {
         headers: {
           Authorization: `Bearer ${authToken}`,
         },
       });
   
       dispatch({
         type: FRIEND_GET_SUCCESS,
         payload: {
           friends: response.data.friends,
         },
       });
     } catch (error) {
       console.log('LINE:500', error.response.data);
     }
   };

export const messageSend = (data) => async(dispatch) => {
    try{
     const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/send-message',data);
     dispatch({
          type : MESSAGE_SEND_SUCCESS,
          payload : {
               message : response.data.message
          }
     })
    }catch (error){
     console.log(error.response.data);
    }
}


// export const getMessage = (id) => {
//      return async(dispatch) => {
//           try{
//                const response = await axios.get(`https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/get-message/${id}`)
//               dispatch({
//                    type : MESSAGE_GET_SUCCESS,
//                    payload : {
//                     message : response.data.message
//                    }
//               })
//           }catch (error){
//                console.log(error.response.data)
//           }
//      }
// }

export const getMessage = (id) => {
     return async (dispatch) => {
       try {
         const authToken = localStorage.getItem('authToken');
         console.log("line:1700", authToken);
   
         const response = await axios.get(
           `https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/get-message/${id}`,
           {
             headers: {
               Authorization: `Bearer ${authToken}`,
             },
           }
         );
   
         dispatch({
           type: MESSAGE_GET_SUCCESS,
           payload: {
             message: response.data.message,
           },
         });
       } catch (error) {
         console.log(error.response.data);
       }
     };
   };


export const ImageMessageSend = (data) => async(dispatch)=>{

     try{
          const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/image-message-send',data);
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload : {
                    message : response.data.message
               }
          })
     }catch (error){
          console.log(error.response.data);

     }

}

export const seenMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/seen-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const updateMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/delivared-message',msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const getTheme = () => async(dispatch) => {

     const theme = localStorage.getItem('theme');
     dispatch({
          type: "THEME_GET_SUCCESS",
          payload : {
               theme : theme? theme : 'white'
          }
     })

}


export const themeSet = (theme) => async(dispatch) => {

     localStorage.setItem('theme',theme);
     dispatch({
          type: "THEME_SET_SUCCESS",
          payload : {
               theme : theme
          }
     })
     
}