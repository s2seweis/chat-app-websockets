/* eslint-disable */
import axios from 'axios';
import {REGISTER_FAIL,REGISTER_SUCCESS,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL} from "../types/authType";

export const userRegister = (data) => {
     return async (dispatch) => {

          const config = {
               headers: {
                    'Content-Type':'application/josn'
               } 
          }
          try{
               const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/user-register',data,config);
               localStorage.setItem('authToken',response.data.token);

               dispatch({
                    type : REGISTER_SUCCESS,
                    payload:{
                         successMessage: response.data.successMessage,
                         token : response.data.token
                    }
               })

          } catch(error){
                dispatch({
                    type: REGISTER_FAIL,
                    payload:{
                         error : error.response.data.error.errorMessage 
                    }
                })
          }

     }
}

export const userLogin = (data) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            // withCredentials: true, // Add this line
        }

        try {
            const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/user-login', data, config);
            localStorage.setItem('authToken', response.data.token);
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })
        } catch (error) {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }
    }
}

// export const userLogout = () => async(dispatch) => {
//      try{
//         const authToken = localStorage.getItem('authToken');
//         console.log("line:1500", authToken);

//          const response = await axios.post('https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/user-logout', {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//               },
//          });
//          if(response.data.success){
//              localStorage.removeItem('authToken');
//              dispatch({
//                  type : 'LOGOUT_SUCCESS'
//              })
//          }

//      }catch (error) {

//      }
// }

export const userLogout = () => async (dispatch) => {
    try {
      const authToken = localStorage.getItem('authToken');
      console.log("line:1500", authToken);
  
      const response = await axios.post(
        'https://react-app-chat-c986801b6d65.herokuapp.com/api/messenger/user-logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.data.success) {
        localStorage.removeItem('authToken');
        dispatch({
          type: 'LOGOUT_SUCCESS',
        });
      }
    } catch (error) {
      // Handle error
    }
  };


