import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const Sidebar = ({ isOpen, onClose }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleAddressDropdown = () => {
    setIsAddressOpen(!isAddressOpen);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t("sidebar_close")}
        >
          <i className="fas fa-times"></i>
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" onClick={onClose}>
                <i className="fas fa-tachometer-alt"></i> {t("dashboard")}
              </Link>
            </li>
            <li>
              <Link to="/users" onClick={onClose}>
                <i className="fas fa-users"></i> {t("users")}
              </Link>
            </li>
            <li>
              <Link to="/statistics" onClick={onClose}>
                <i className="fas fa-chart-bar"></i> {t("statistics")}
              </Link>
            </li>
            <li>
              <a style={{ cursor: "pointer" }} onClick={toggleAddressDropdown}>
                <i className="fas fa-map-marker-alt"></i> {t("address")}{" "}
                {isAddressOpen ? "↑" : "↓"}
              </a>
              {isAddressOpen && (
                <ul style={{ margin: "18px" }}>
                  <li>
                    <Link to="/cities" onClick={onClose}>
                      <i className="fas fa-city"></i> {t("cities")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/councils" onClick={onClose}>
                      <i className="fas fa-landmark"></i> {t("councils")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/villagestowns" onClick={onClose}>
                      <i className="fas fa-home"></i> {t("villages_towns")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/communes" onClick={onClose}>
                      <i className="fas fa-building"></i> {t("communes")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/backup" onClick={onClose}>
                <i className="fa-solid fa-database" /> backup
              </Link>
            </li>
          </ul>
          <div className="sidebar-footer">
            <button
              className="logout-btn"
              onClick={logout}
              aria-label={t("logout")}
            >
              <i
                className={`fas fa-sign-out-alt ${
                  i18n.language === "ar" ? "fa-flip-horizontal" : ""
                }`}
              ></i>
              {t("logout")}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
