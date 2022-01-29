import {
  ActionFunction,
  LoaderFunction,
  useLoaderData,
  useActionData,
  json,
} from "remix";
import { useEffect, useState } from "react";
import styles from "../styles/game.css";

import { axios } from "~/utils/axios";
import { AxiosError } from "axios";
import { getToken } from "~/utils/token";

const wordPattern = "^[a-zA-Z]+$";
const wordRegex = new RegExp(wordPattern);

type ActionData = {
  formError?: string;
  fieldErrors?: {
    word: string | undefined;
  };
  fields?: {
    word: string;
  };
  message?: string;
  score?: number;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();
  const word = form.get("word");
  const accessToken = form.get("accessToken");

  if (!word) {
    return badRequest({
      formError: "Word must not be empty",
    });
  }

  const apiResponse = await axios
    .post(
      "/words",
      { word },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .catch((error: AxiosError) => error.response);

  console.log({ apiResponse }, apiResponse?.status);

  if (apiResponse?.status === 420) {
    return badRequest({
      formError: "You have already tried that word.",
    });
  }

  if (apiResponse?.status !== 200) {
    return badRequest({
      formError: apiResponse?.data?.message || "API Request failed",
    });
  }

  const { score } = apiResponse?.data;

  let message = "Success!";

  if (score === 0) {
    message = "Failure!";
  }

  return {
    message,
    score,
    fields: {
      word,
    },
  };
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function validateWord(word: string) {
  if (!word) {
    return false;
  }

  if (word.length < 3 || word.length > 10) {
    return false;
  }

  if (!word.match(wordRegex)) {
    return false;
  }

  return true;
}

// export const loader: LoaderFunction = async () => {
//   const userScoreResponse = await axios
//     .get("/users/self")
//     .catch((error) => ({ data: { score: 0 } }));

//   return userScoreResponse?.data || { score: 0 };
// };

export default function Game() {
  const [word, setWord] = useState("");
  const actionData = useActionData<ActionData>();
  // let userData = useLoaderData();

  const [accessToken, setAccessToken] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    setAccessToken(getToken() || "");
  }, []);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("/users/self", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((result) => setScore(result.data.score));
    }
  }, [accessToken]);

  // const score = userData.score;
  const wordIsValid = validateWord(word);

  return (
    <div className="game page-wrapper container">
      <h1>Your Score: {score}</h1>

      <form
        method="post"
        onSubmit={() => {
          setTimeout(() => {
            setWord("");
          }, 100);
        }}
      >
        <div className="input-wrapper">
          <label htmlFor="word-input" className="label form-label sr-only">
            Word
          </label>
          <input
            className="form-control"
            id="word-input"
            value={word}
            name="word"
            placeholder="Word"
            onInput={(event) => setWord(event.currentTarget.value)}
            minLength={3}
            maxLength={10}
            pattern={wordPattern}
          />
        </div>

        <input type="hidden" value={accessToken} />

        <div className="feedback-wrapper">
          {word === "" && <div>Enter a word to play.</div>}
          {actionData && actionData?.message && actionData?.score === 2 && (
            <>
              <div className="success">
                Success! "{actionData?.fields?.word}" isn't a repo in npm. (yet)
              </div>
              <h2>2 points</h2>
            </>
          )}

          {actionData && actionData?.message && actionData?.score === 1 && (
            <div className="success">
              Success! Kind of. "{actionData?.fields?.word}" wasn't an exact
              match, but it was pretty close.
              <h2>1 point</h2>
            </div>
          )}

          {actionData && actionData?.message && actionData?.score === 0 && (
            <>
              <div className="failure">
                Failure! "{actionData?.fields?.word}" a repo in npm already.
              </div>
              <h2>0 points</h2>
            </>
          )}
          {!wordIsValid && word !== "" && (
            <div className="error">
              Word is not valid. It must be between 3 and 10 characters and have
              no spaces, numbers, or special characters.
            </div>
          )}
          {actionData?.formError && (
            <div className="error">
              Error submitting word to API:
              <div>{actionData?.formError}</div>
            </div>
          )}
        </div>

        <div className="submit-button">
          <button className="btn btn-primary" disabled={!wordIsValid}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
