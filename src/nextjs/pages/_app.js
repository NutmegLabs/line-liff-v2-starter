import "../styles/globals.css";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps, router }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff").then((liff) => {
      console.log("start liff.init()...");
      console.log(process.env.NEXT_PUBLIC_LIFF_ID);
      liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID})
        .then(() => {
          console.log("liff.init() done");
          setLiffObject(liff);
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri:"https://hieizan.book.stg.ntmg.com/" });
          }
        })
        .catch((error) => {
          console.log(`liff.init() failed: ${error}`);
          if (!process.env.NEXT_PUBLIC_LIFF_ID) {
            console.info(
              "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
            );
          }
          setLiffError(error.toString());
        });
    });
  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property

  console.log('MyApp', liffObject);
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return <Component {...pageProps} />;
}

export default MyApp;
