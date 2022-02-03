import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  LoaderFunction,
  useLoaderData,
  redirect,
} from "remix";
import { setToken } from "~/utils/token";
import styles from "../styles/advc.css";
import { unauthenticatedAxios } from "../utils/axios";
import { AdvcCallbackStatusCode } from "../utils/types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async () => {
  const axios = unauthenticatedAxios(process.env.BASE_URL || "");

  const qrCodeResponse = await axios.get("/advc/login").catch((error) => {
    console.log("error", error);
    return { data: { qrCode: "", state: "" } };
  });

  console.log("response", qrCodeResponse);

  return qrCodeResponse?.data || { qrCode: "", state: "" };
};

export default function ADVC() {
  const navigate = useNavigate();
  const { qrCode, state: loginState } = useLoaderData();

  const [codeScanned, setCodeScanned] = useState(false);
  const [requestTimedOut, setRequestTimedOut] = useState(false);

  useEffect(() => {
    const axios = unauthenticatedAxios((window as any).ENV.BASE_URL);

    let interval: NodeJS.Timer;
    if (qrCode && loginState) {
      // hit backend api on interval
      interval = setInterval(async () => {
        // navigate("/game");
        const defaultResponseData = { code: "", createdAt: 0, accessToken: "" };

        const pingResult = await axios
          .post("/advc/token", {
            state: loginState,
          })
          .catch(() => ({ data: defaultResponseData }));

        const { code, createdAt, accessToken } =
          pingResult?.data || defaultResponseData;

        if (createdAt + 30000 < Date.now()) {
          setRequestTimedOut(true);
          clearInterval(interval);
        } else if (code === AdvcCallbackStatusCode.RequestRetrieved) {
          setCodeScanned(true);
        } else if (code === AdvcCallbackStatusCode.PresentationVerified) {
          // set token in storage
          setToken(accessToken);
          navigate("/game");
        }
      }, 3000);
    }

    return function () {
      clearInterval(interval || 0);
    };
  }, [qrCode, loginState]);

  return (
    <div className="login page-wrapper container">
      <div className="content">
        {!qrCode && (
          <>
            <h1>Error generating QR Code.</h1>
            <p>Please refresh and try again.</p>
          </>
        )}

        {qrCode && !codeScanned && !requestTimedOut && (
          <>
            <h2>Prerequisites</h2>
            <p>
              First make sure you have created a Verifiable Credential at{" "}
              <a href="https://425show.com" target="_blank" rel="noreferrer">
                425show.com
              </a>
              . You will need to pick "Stream Viewer" from the select field when
              creating your credential.
            </p>

            <h3 className="h1">then...</h3>

            <p>Scan this QR code using the MS Authenticator app</p>
            <img src={qrCode} />
          </>
        )}

        {qrCode && codeScanned && (
          <>
            <h2>Code Scanned</h2>
            <p>Waiting for response from MS Authenticator app...</p>
          </>
        )}

        {requestTimedOut && (
          <>
            <h3>Request timed out.</h3>
            <p>Please refresh and try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
