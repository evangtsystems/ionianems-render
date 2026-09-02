import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { logout } from "./slices/authSlice";
import CookieConsent from "react-cookie-consent";
import { I18nextProvider } from "react-i18next";
import i18n from "./locales/i18n";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Keep backend alive
const keepBackendAlive = () => {
  setInterval(async () => {
    try {
      await axios.get("https://ionianems-backend.onrender.com/ping");
    } catch (error) {
      console.error("Backend inactive:", error);
    }
  }, 5 * 60 * 1000);
};

function App() {
  const dispatch = useDispatch();

  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [showModifyConsent, setShowModifyConsent] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);

  useEffect(() => {
    keepBackendAlive();
  }, []);

  // Google Preferred Sources
 useEffect(() => {
  window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || [];

  window.PREFERRED_SOURCE.push((preferredSource) => {
    preferredSource.init({
      theme: "light",
      lang: "en",
    });

    const button = document.getElementById("google-preferred-source-btn");

    if (!button) return;

    button.onclick = () => {
      preferredSource.addPreferredSource();
    };
  });
}, []);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
      return;
    }

    const handleInitialized = () => {
      setIsI18nReady(true);
    };

    i18n.on("initialized", handleInitialized);

    return () => {
      i18n.off("initialized", handleInitialized);
    };
  }, []);

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");

    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesAccepted");

    if (!consent) {
      const cookies = document.cookie.split("; ");

      const consentCookie = cookies.find((row) =>
        row.startsWith("cookiesAccepted=")
      );

      if (consentCookie) {
        const value = consentCookie.split("=")[1];
        localStorage.setItem("cookiesAccepted", value);
      }
    }
  }, []);

  const handleModifyConsent = () => {
    localStorage.removeItem("cookiesAccepted");

    document.cookie =
      "gdprConsent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    setShowModifyConsent(true);
  };

  if (!isI18nReady) {
    return <div>Loading translations...</div>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ToastContainer />

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="userConsent"
        expires={365}
        style={{
          background: "#222",
          color: "#fff",
        }}
        buttonStyle={{
          background: "#36b34d",
          color: "#fff",
          fontSize: "14px",
        }}
        declineButtonStyle={{
          background: "#e74c3c",
          color: "#fff",
          fontSize: "14px",
        }}
        onAccept={() => {
          setCookiesAccepted(true);
          localStorage.setItem("cookiesAccepted", "true");
        }}
        onDecline={() => {
          setCookiesAccepted(false);
          localStorage.setItem("cookiesAccepted", "false");
        }}
      >
        We use cookies to improve your experience. By clicking "Accept", you
        agree to our privacy policy.

        <Link
          to="/privacy-policy"
          style={{
            color: "#3498db",
            marginLeft: "5px",
          }}
        >
          Learn More
        </Link>
      </CookieConsent>

      <Header />

      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Google Preferred Sources */}
<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "24px 0",
  }}
>
  <button
    id="google-preferred-source-btn"
    type="button"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",

      background: "#ffffff",
      color: "#3c4043",

      border: "1px solid #dadce0",
      borderRadius: "999px",

      padding: "10px 18px",

      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Arial, sans-serif",

      cursor: "pointer",

      boxShadow: "0 1px 2px rgba(60,64,67,0.18)",
    }}
  >
    <img
  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
  alt="Google"
  width="20"
  height="20"
/>

    <span>Add to Google Preferred Sources</span>
  </button>
</div>


      <Footer />
    </I18nextProvider>
  );
}

export default App;