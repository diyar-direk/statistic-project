import { Link } from "react-router";
import "./not-found.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h3>Oops! The page you’re looking for doesn’t exist.</h3>
      <h2>It seems you’re a bit lost.</h2>
      <Link to="/" className="btn contained main">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
