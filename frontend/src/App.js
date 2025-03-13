import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { logout } from "./slices/authSlice";
import CookieConsent from "react-cookie-consent";
import { I18nextProvider } from "react-i18next";
import i18n from "./locales/i18n"; // Import i18n here
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [showModifyConsent, setShowModifyConsent] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized); // ✅ Starts with i18n state

  useEffect(() => {
    // ✅ If already initialized, set immediately
    if (i18n.isInitialized) {
      setIsI18nReady(true);
      return;
    }

    // ✅ Listen for initialization event
    const handleInitialized = () => {
      setIsI18nReady(true);
    };

    i18n.on("initialized", handleInitialized);

    // ✅ Cleanup event listener on unmount
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
      "gdprConsent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Clear cookie
    setShowModifyConsent(true);
  };

  // ✅ Display loading until i18n is ready
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
        style={{ background: "#222", color: "#fff" }}
        buttonStyle={{ background: "#36b34d", color: "#fff", fontSize: "14px" }}
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
          style={{ color: "#3498db", marginLeft: "5px" }}
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
      <Footer />
    </I18nextProvider>
  );
};

export default App;
