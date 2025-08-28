import { useState, useEffect } from "react";
import "./Header.css";
import { useTranslation } from "react-i18next";

const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [isDarkMode, i18n.language]);

  const handleModeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSidebarToggle = () => {
    onSidebarToggle(!isSidebarOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <header className={`app-header ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="header-content">
        <button
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          aria-label={isSidebarOpen ? t("sidebar_close") : t("sidebar_open")}
        >
          <i
            className={`fas fa-${isSidebarOpen ? "xmark" : "bars-staggered"}`}
          ></i>
        </button>
        <h1 className="app-title">{t("app_title")}</h1>
        <div className="header-actions">
          
          <select
            className="language-switcher h12"
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="ku">Kurdî</option>
          </select>
          <button
            className="mode-toggle"
            onClick={handleModeToggle}
            aria-label={
              isDarkMode ? t("switch_to_light_mode") : t("switch_to_dark_mode")
            }
          >
            <i className={`fas fa-${isDarkMode ? "sun" : "moon"}`}></i>
          </button>
  
        </div>
      </div>
    </header>
  );
};

export default Header;