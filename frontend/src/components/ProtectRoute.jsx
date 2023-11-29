/* eslint-disable */

import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom'

const ProtectRoute = ({children}) => {
     
     const {authenticate} = useSelector(state=>state.auth);     
     // return authenticate ? children : <Navigate to="/messenger/login" />

     return(
          authenticate ? <Outlet/> 
          : <Navigate to="/messenger/login"/>
          // : <Outlet/> 
      )
};

export default ProtectRoute;

