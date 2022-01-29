import { useEffect } from "react";
import { Link, LoaderFunction, useLoaderData, useNavigate } from "remix";
import { axios } from "~/utils/axios";
import { setToken } from "~/utils/token";
import styles from "../../styles/index.css";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const code = url.searchParams.get("code");

  console.log({ code, provider });

  const defaultData = { accessToken: "" };
  const callbackResponse = await axios
    .post(`/oauth/${provider}/callback`, { code })
    .catch((error) => {
      console.log("error exchanging code", error);
      return { data: defaultData };
    });

  return callbackResponse?.data || defaultData;
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function OAuth() {
  const navigate = useNavigate();
  const { accessToken } = useLoaderData();

  useEffect(() => {
    if (accessToken) {
      setToken(accessToken);
      setTimeout(() => {
        navigate("/game");
      }, 3000);
    }
  }, []);

  return (
    <div className="oauth page-wrapper container">
      {!accessToken && (
        <>
          <h1>OAuth failed.</h1>
          <p>
            Please try <Link to="/login">logging in</Link> again
          </p>
        </>
      )}

      {accessToken && (
        <>
          <h1>OAuth Success</h1>
          <p>
            Redirecting you to <Link to="/game">the game</Link>.
          </p>
        </>
      )}
    </div>
  );
}
