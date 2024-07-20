import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../routes/Context';
import socketIOClient from 'socket.io-client';

const Header = () => {
  const { logout, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = socketIOClient(process.env.REACT_APP_API_URL, {
      query: { accessToken },
    });

    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [accessToken]);

  const handleLogout = () => {
    if (socket) {
      // Optionally emit a logout event if needed by the server
      socket.emit('logout');
      socket.disconnect(); // Disconnect the socket
    }
    logout(); // Call the logout function from useAuth
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list nav__list--left">
          <li className="nav__item">
            <Link to="/patients" className="nav__link">Patients</Link>
          </li>
          <li className="nav__item">
            <Link to="/chathistory" className="nav__link">Chat History</Link>
          </li>
          <li className="nav__item">
            <Link to="/chatrequest" className="nav__link">Chat Request</Link>
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
