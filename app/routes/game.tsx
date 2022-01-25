import { useState } from "react";
import styles from "../styles/game.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Game() {
  const [word, setWord] = useState("");

  const score = 0;

  return (
    <div className="game page-wrapper container">
      <h1>Your Score: {score}</h1>

      <div className="input-wrapper">
        <label htmlFor="word-input" className="label form-label sr-only">
          Word
        </label>
        <input
          className="form-control"
          id="word-input"
          value={word}
          placeholder="Word"
          onInput={(event) => setWord(event.currentTarget.value)}
        />
      </div>

      <button className="btn btn-primary">hmmmmm</button>
    </div>
  );
}
