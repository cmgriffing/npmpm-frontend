import { Link } from "remix";
import styles from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function OAuth() {
  return <div className="oauth page-wrapper container"></div>;
}
