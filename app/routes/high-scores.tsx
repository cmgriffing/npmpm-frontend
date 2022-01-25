import styles from "../styles/high-scores.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function HighScores() {
  const highScores = [
    {
      user: {
        id: "foo",
      },
      score: 0,
    },
    {
      user: {
        id: "foo1",
      },
      score: 0,
    },
    {
      user: {
        id: "foo2",
      },
      score: 0,
    },
    {
      user: {
        id: "foo3",
      },
      score: 0,
    },
    {
      user: {
        id: "foo4",
      },
      score: 0,
    },
  ];

  const topWords = [
    {
      word: "foo",
      count: 0,
    },
    {
      word: "foo1",
      count: 0,
    },
    {
      word: "foo2",
      count: 0,
    },
    {
      word: "foo3",
      count: 0,
    },
    {
      word: "foo4",
      count: 0,
    },
  ];

  return (
    <div className="high-scores page-wrapper container">
      <div className="row">
        <h1>High Scores</h1>

        <section className="user-scores list-wrapper col">
          <h2 className="underlined-subtle">Users</h2>
          <ol className="list">
            {highScores.map((userScore) => (
              <li className="d-flex flex-row">
                <span>{userScore.user.id}</span>
                <span className="spacer" />
                <span>{userScore.score}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="word-counts list-wrapper col">
          <h2 className="underlined-subtle">Words</h2>
          <ol className="list">
            {topWords.map((wordCount) => (
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
