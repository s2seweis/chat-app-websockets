/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure to create a corresponding CSS file for styling

const Navbar = () => {
  return (
    <div className="navbar" style={{ justifyContent: "space-evenly" }}>
      <Link to="/" className="nav-item">
        Chats
      </Link>
      <Link to="/" className="nav-item">
        Latest
      </Link>
      <Link to="/" className="nav-item">
        Calls
      </Link>
    </div>
  );
};

export default Navbar;
