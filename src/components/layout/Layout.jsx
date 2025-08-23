import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import './Layout.css';

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen); // تحديث حالة الفتح/الإغلاق
  };

  const handleCloseSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false); // إغلاق فقط إذا كان مفتوحًا
    }
  };

  return (
    <div className="app-layout">
      <Header 
        onLogout={onLogout} 
        onSidebarToggle={handleSidebarToggle} 
        isSidebarOpen={isSidebarOpen} // تمرير حالة السايد بار
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <main className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
