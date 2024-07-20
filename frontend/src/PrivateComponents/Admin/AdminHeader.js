import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../routes/Context';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list nav__list--left">
          <li className="nav__item">
            <Link to="/assigndoctor" className="nav__link">Assign</Link>
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
