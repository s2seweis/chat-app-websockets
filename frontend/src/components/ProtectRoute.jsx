import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({children}) => {
     

     const {authenticate} = useSelector(state=>state.auth);
     console.log("line:600", authenticate);
     return authenticate ? children : <Navigate to="/messenger/login" />


 
};

export default ProtectRoute;

