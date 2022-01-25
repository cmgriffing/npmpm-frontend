import { Link } from "remix";
import styles from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <div className="index page-wrapper container">
      <h1>NPMPM: NPM Possible Match</h1>
      <p className="description text-start">
        Something about the game goes here like the rules
      </p>
      <Link to="/login" className="btn btn-primary">
        Get Started
      </Link>
    </div>
  );
}
