import { useEffect, useState } from "react";
import { Link, useNavigate, LoaderFunction, useLoaderData } from "remix";
import { getToken, setToken } from "~/utils/token";
import styles from "../styles/high-scores.css";
import githubLogo from "../images/GitHub-Mark-Light-64px.png";
import twitchLogo from "../images/TwitchGlitchWhite.png";
import { authenticatedAxios } from "~/utils/axios";

interface WordScore {
  word: string;
  count: number;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader() {
  return {
    ENV: {
      BASE_URL: process.env.BASE_URL,
    },
  };
}

export default function Login() {
  const {
    ENV: { BASE_URL },
  } = useLoaderData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [availableScores, setAvailableScores] = useState<WordScore[]>([]);
  const [unavailableScores, setUnavailableScores] = useState<WordScore[]>([]);

  useEffect(() => {
    const token = getToken() || "";
    const axios = authenticatedAxios(BASE_URL, token);

    axios
      .get("/words/top")
      .then((results) => {
        console.log("results", results.data);
        setAvailableScores(results.data.availableScores);
        setUnavailableScores(results.data.unavailableScores);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!error?.response?.status || error.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  return (
    <div className="login page-wrapper container">
      <div className="row">
        <h1>High Scores</h1>
        <p>We have hidden words you haven't guessed yet. No cheating.</p>
        <section className="high-score-list list-wrapper col">
          <h2 className="underlined-subtle">Available</h2>
          {isLoading && <div className="loader"></div>}
          <ol className="list">
            {availableScores?.map((wordCount: WordScore) => (
              <li className="d-flex flex-row">
                <span>{wordCount.word}</span>
                <span className="spacer" />
                <span>{wordCount.count}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="high-score-list list-wrapper col">
          <h2 className="underlined-subtle">Existing</h2>
          {isLoading && <div className="loader"></div>}
          <ol className="list">
            {unavailableScores?.map((wordCount: WordScore) => (
              <li className="d-flex flex-row">
                <span>{wordCount.word}</span>
                <span className="spacer" />
                <span>{wordCount.count}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
