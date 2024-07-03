import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      <h2 className="header-title">Welcome to Employee Management System</h2>
      <div className="buttons-div">
        <Link to="/signup">
          <button className="action-button">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="action-button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
