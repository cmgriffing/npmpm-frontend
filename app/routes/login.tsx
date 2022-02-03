import { useEffect } from "react";
import { Link, useNavigate, LoaderFunction, useLoaderData } from "remix";
import { setToken } from "~/utils/token";
import styles from "../styles/login.css";
import githubLogo from "../images/GitHub-Mark-Light-64px.png";
import twitchLogo from "../images/TwitchGlitchWhite.png";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader() {
  return {
    ENV: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
      BASE_URL: process.env.BASE_URL,
      TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
      TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
    },
  };
}

export default function Login() {
  const { ENV } = useLoaderData();
  const {
    GITHUB_CLIENT_ID,
    GITHUB_CALLBACK_URL,
    TWITCH_CLIENT_ID,
    TWITCH_CALLBACK_URL,
  } = ENV;

  const GITHUB_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scopes=user`;
  const TWITTER_URL = "";
  const TWITCH_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_CALLBACK_URL}&response_type=code&scopes=user:read:email`;

  useEffect(() => {
    setToken("");
  }, []);

  return (
    <div className="login page-wrapper container">
      <div className="row">
        <h1>Login</h1>

        <section className="login-list list-wrapper col">
          <h2 className="underlined-subtle">Session Based</h2>
          <a className="btn btn-primary btn-microsoft d-block m-2" href="/advc">
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
            <img className="btn-logo" src={githubLogo} /> Github
          </a>
          <a
            className="btn btn-primary btn-twitch d-block m-2"
            href={TWITCH_URL}
          >
            <img className="btn-logo" src={twitchLogo} /> Twitch
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
