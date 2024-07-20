import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../routes/Context';
import socketIOClient from 'socket.io-client';
import PatientChatBot from './PatientChatBot';

const Header = () => {
  const { logout, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = socketIOClient(process.env.REACT_APP_API_URL, {
      query: { accessToken },
    });
    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [accessToken]);

  const handleLogout = () => {
    if (socket) {
      // Emit logout event if needed
      socket.emit('logout'); // Optional, depending on your server-side logic
      socket.disconnect(); // Disconnect the socket
    }
    logout(); // Call the logout function from useAuth
  };

  return (
    <header className="header">
      <PatientChatBot />
      <nav className="nav">
        <ul className="nav__list nav__list--left">
          <li className="nav__item">
            <Link to="/interactionhistory" className="nav__link">Interaction history</Link>
          </li>
          <li className="nav__item">
            <Link to="/linkeddoctor" className="nav__link">Linked doctor</Link>
          </li>
        </ul>
        <ul className="nav__list nav__list--right">
          <li className="nav__item">
            <button onClick={handleLogout} className="nav__button">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
