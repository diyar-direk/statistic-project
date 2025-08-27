import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const { logout } = useAuth();

  const toggleAddressDropdown = () => {
    setIsAddressOpen(!isAddressOpen);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" onClick={onClose}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/users" onClick={onClose}>
                <i className="fas fa-users"></i> Users
              </Link>
            </li>
            <li>
              <Link to="/statistics" onClick={onClose}>
                <i className="fas fa-chart-bar"></i> Statistics
              </Link>
            </li>
            <li>
              <a style={{ cursor: "pointer" }} onClick={toggleAddressDropdown}>
                <i className="fas fa-map-marker-alt"></i> Address{" "}
                {isAddressOpen ? "↑" : "↓"}
              </a>
              {isAddressOpen && (
                <ul style={{ margin: "18px" }}>
                  <li>
                    <Link to="/cities" onClick={onClose}>
                      <i className="fas fa-city"></i> Cities
                    </Link>
                  </li>
                  <li>
                    <Link to="/councils" onClick={onClose}>
                      <i className="fas fa-landmark"></i> Councils
                    </Link>
                  </li>
                  <li>
                    <Link to="/villagestowns" onClick={onClose}>
                      <i className="fas fa-home"></i> Villages/Towns
                    </Link>
                  </li>
                  <li>
                    <Link to="/communes" onClick={onClose}>
                      <i className="fas fa-building"></i> Communes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* إزالة العنصر المتكرر "Users" */}
          </ul>
          {/* وضع زر Logout في الأسفل */}
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={logout} aria-label="Logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
