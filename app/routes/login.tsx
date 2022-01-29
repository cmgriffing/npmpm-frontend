import { useEffect } from "react";
import { Link, useNavigate, LoaderFunction, useLoaderData } from "remix";
import { setToken } from "~/utils/token";
import styles from "../styles/login.css";
import { axios } from "../utils/axios";

const GITHUB_URL = "";
const TWITTER_URL = "";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    setToken("");
  }, []);

  return (
    <div className="login page-wrapper container">
      <h1>Login</h1>

      <a className="btn btn-primary btn-github d-block m-2" href="/advc">
        Microsoft Identity
      </a>
      {/*
      <a className="btn btn-primary btn-github d-block m-2" href={GITHUB_URL}>
        Github
      </a>
      <a className="btn btn-primary btn-github d-block m-2" href={TWITTER_URL}>
        Twitter
      </a> */}
    </div>
  );
}
