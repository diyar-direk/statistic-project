
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-xmark"></i>
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li>Dashboard</li>
          <li>Categories</li>
          <li>Users</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
