import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import './Layout.css';

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();


  const noLayoutRoutes = ['/login'];

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleCloseSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };


  if (noLayoutRoutes.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="app-layout">
      <Header
        onLogout={onLogout}
        onSidebarToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <main className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
