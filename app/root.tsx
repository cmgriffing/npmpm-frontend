import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import githubIcon from "./images/GitHub-Mark-64px.png";

import styles from "bootswatch/dist/lumen/bootstrap.min.css";
import commonStyles from "./common.css";
import { useEffect, useState } from "react";
import { getToken } from "./utils/token";

export const meta: MetaFunction = () => {
  return { title: "NPMPM: NPM Possible Match" };
};

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: commonStyles },
  ];
}

export default function App() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setAccessToken(getToken() || "");
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="header text-end">
          <nav className="nav d-inline-block">
            <NavLink to="/rules">Rules</NavLink>
            {accessToken && (
              <>
                <NavLink to="/game">Game</NavLink>
                {/* <NavLink to="/high-scores">High Scores</NavLink> */}
              </>
            )}
          </nav>
          <a href="https://github.com/cmgriffing/npmpm-frontend">
            <img className="github-logo" src={githubIcon} />
          </a>
        </header>
        <Outlet />
        <footer className="underlined">
          <div className="footer d-flex align-items-center justify-content-center">
            <span className="spacer"></span>
            <span>Not affiliated with NPM inc.</span>
            <span className="spacer"></span>
            <span>
              Built with <a href="https://remix.run/">Remix</a> and{" "}
              <a href="https://arc.codes/">Architect</a>
            </span>
            <span className="spacer"></span>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
