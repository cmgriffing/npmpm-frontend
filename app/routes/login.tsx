import { useEffect } from "react";
import { Link, useNavigate } from "remix";
import styles from "../styles/login.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/game");
    }, 3000);
  });

  return (
    <div className="login page-wrapper container">
      <h1>Logging in...</h1>
    </div>
  );
}
