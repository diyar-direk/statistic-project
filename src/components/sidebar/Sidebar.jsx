import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-xmark"></i>
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" onClick={onClose}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/addinformation" onClick={onClose}>
                Add Information
              </Link>
            </li>
            <li>
              <Link to="/users" onClick={onClose}>
                Users
              </Link>
            </li>
            <li>
              <Link to="/cities" onClick={onClose}>
                cities
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
