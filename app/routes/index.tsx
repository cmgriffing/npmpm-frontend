import { Link } from "remix";
import styles from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  return (
    <div className="index page-wrapper container">
      <img className="logo" src="/logo.png" />

      <h1>NPMPM: NPM Possible Match</h1>
      <p className="description text-start">
        Your mission, should you choose to accept it, is to find English words
        that are not already repos in NPM.
      </p>
      <p className="description text-start">
        It's harder than you think. Check out the <Link to="/rules">Rules</Link>{" "}
        to find out more.
      </p>
      <h3 className="cta-title">Think you have what it takes?</h3>
      <Link to="/login" className="btn btn-primary">
        Get Started
      </Link>
    </div>
  );
}
