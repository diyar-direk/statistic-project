import { useState } from "react";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout } = useAuth();

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  const handleSidebarToggle = () => {
    onSidebarToggle(!isSidebarOpen);
  };

  return (
    <header className={`app-header ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="header-content">
        <button
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <i
            className={`fas fa-${isSidebarOpen ? "xmark" : "bars-staggered"}`}
          ></i>
        </button>
        <h1 className="app-title">Statistics Project</h1>
        <div className="header-actions">
          <button
            className="mode-toggle"
            onClick={handleModeToggle}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <i className={`fas fa-${isDarkMode ? "sun" : "moon"}`}></i>
          </button>
          <button className="logout-btn" onClick={logout} aria-label="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
