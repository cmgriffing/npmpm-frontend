import { useEffect } from "react";
import { Link, useNavigate, LoaderFunction, useLoaderData } from "remix";
import { setToken } from "~/utils/token";
import styles from "../styles/login.css";
import { axios } from "../utils/axios";

const GITHUB_CALLBACK_URL =
  "https://d95bb74e9fe7.ngrok.io/oauth/callback?provider=github";
const GITHUB_CLIENT_ID = "e42683918538cb70258c";

const GITHUB_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scopes=user`;
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
      <div className="row">
        <h1>Login</h1>

        <section className="login-list list-wrapper col">
          <h2 className="underlined-subtle">Session Based</h2>
          <a className="btn btn-primary btn-github d-block m-2" href="/advc">
            Microsoft Identity
          </a>
          <details className="text-start">
            <summary>Scores are only related to each login session.</summary>
            <p>
              Due to a bug in the Microsoft Identity process, we are not able to
              associate a VC to a persistent ID at this time. They are actively
              working on it.
            </p>
          </details>
        </section>
        <section className="login-list list-wrapper col">
          <h2 className="underlined-subtle">Persistent</h2>
          <a
            className="btn btn-primary btn-github d-block m-2"
            href={GITHUB_URL}
          >
            Github
          </a>
          {/*
      <a className="btn btn-primary btn-github d-block m-2" href={TWITTER_URL}>
        Twitter
      </a> */}
        </section>
      </div>
    </div>
  );
}
