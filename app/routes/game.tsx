import {
  ActionFunction,
  LoaderFunction,
  useLoaderData,
  useActionData,
  json,
  useNavigate,
} from "remix";
import { useEffect, useState } from "react";
import styles from "../styles/game.css";

import { authenticatedAxios, unauthenticatedAxios } from "~/utils/axios";
import { AxiosError } from "axios";
import { getToken } from "~/utils/token";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  repo?: {
    name: string;
    description: string;
    url: string;
    version: string;
    lastUpdated: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();
  const word = form.get("word");
  const accessToken = form.get("accessToken") as string;
  const axios = authenticatedAxios(
    process.env.BASE_URL || "",
    accessToken || ""
  );

  if (!word) {
    return badRequest({
      formError: "Word must not be empty",
    });
  }

  const apiResponse = await axios
    .post("/words", { word })
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

  const { score, repo } = apiResponse?.data;

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
    repo,
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

export async function loader() {
  return {
    ENV: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
      BASE_URL: process.env.BASE_URL,
    },
  };
}

export default function Game() {
  const [word, setWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const actionData = useActionData<ActionData>();
  // let userData = useLoaderData();
  const navigate = useNavigate();
  const { ENV } = useLoaderData();

  const [accessToken, setAccessToken] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      setAccessToken(token || "");
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const axios = authenticatedAxios(ENV.BASE_URL, accessToken);
      axios
        .get("/users/self")
        .then((result) => {
          setScore(result.data.score);
          setIsLoading(false);
        })
        .catch((error) => {
          if (!error?.response?.status || error.response.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [accessToken]);

  // const score = userData.score;
  const wordIsValid = validateWord(word);

  return (
    <div className="game page-wrapper container">
      <h1>
        Your Score: {isLoading && <div className="loader score-loader"></div>}
        {!isLoading && score}
      </h1>

      <form
        method="post"
        onSubmit={() => {
          setIsSubmitting(true);
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
            autoFocus
          />
        </div>

        <input type="hidden" name="accessToken" value={accessToken} />

        <div className="feedback-wrapper">
          {word === "" && !isSubmitting && !actionData?.formError && (
            <div>Enter a word to play.</div>
          )}
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
                Failure! "{actionData?.fields?.word}" is a repo in npm already.
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
            Submit {isSubmitting && <div className="loader"></div>}
          </button>
        </div>

        {actionData && actionData?.repo && actionData?.score === 0 && (
          <div className="repo-details">
            <h3>Repo details:</h3>
            <a href={actionData.repo.url} className="repo-link text-start">
              <div className="d-flex">
                <div>
                  <span className="label">Name:</span> {actionData.repo.name}
                </div>
                <div className="spacer"></div>
                <div>
                  <span className="label">Version:</span>{" "}
                  {actionData.repo.version}
                </div>
              </div>
              <div>
                <span className="label">Description:</span>{" "}
                {actionData.repo.description}
              </div>
              <div>
                <span className="label">Last Updated:</span>{" "}
                {dayjs().to(dayjs(actionData.repo.lastUpdated))}
              </div>
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
