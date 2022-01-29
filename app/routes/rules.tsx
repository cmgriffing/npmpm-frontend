import { Link } from "remix";
import styles from "../styles/rules.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Rules() {
  return (
    <div className="index page-wrapper container">
      <h1>Rules</h1>
      <ul>
        <li>Letters only</li>
        <li>Real words</li>
        <li>English only</li>
        <li>3 letters minimum</li>
        <li>10 letters maximum</li>
      </ul>
      <Link to="/login" className="btn btn-primary">
        Get Started
      </Link>
    </div>
  );
}
