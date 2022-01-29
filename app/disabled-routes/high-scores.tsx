import { LoaderFunction, useLoaderData } from "remix";
import { axios } from "../utils/axios";
import styles from "../styles/high-scores.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface WordScore {
  word: string;
  count: number;
}

export const loader: LoaderFunction = async () => {
  const defaultData: {
    availableScores: WordScore[];
    unavailableScores: WordScore[];
  } = { availableScores: [], unavailableScores: [] };

  const userScoreResponse = await axios
    .get("/words/top")
    .catch((error) => ({ data: defaultData }));

  console.log(userScoreResponse.data);

  return userScoreResponse?.data || defaultData;
};

export default function HighScores() {
  const response = useLoaderData();
  const { availableScores, unavailableScores } = response;

  console.log({ response, availableScores, unavailableScores });

  return (
    <div className="high-scores page-wrapper container">
      <div className="row">
        <h1>High Scores</h1>

        <section className="user-scores list-wrapper col">
          <h2 className="underlined-subtle">Available</h2>
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
        <section className="word-counts list-wrapper col">
          <h2 className="underlined-subtle">Unavailable</h2>
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
