import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './components/Login';
import Messenger from './components/Messenger';
import ProtectRoute from './components/ProtectRoute';
import Register from './components/Register';
import ScrollToTop from 'react-scroll-to-top';

function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop color="black" smooth />
        <Routes>
          <Route path="/messenger/login" element={<Login />} />
          <Route path="/messenger/register" element={<Register />} />
          <Route element={<ProtectRoute />}>
            <Route path="/" element={<Messenger />} />
            {/* <Route path="/guardian/:myId" element={<Guardian />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>,

    </div>
  );
}

export default App;
