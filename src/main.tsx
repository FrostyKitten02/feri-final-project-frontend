import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import AppRouter from "./routing/AppRouter";
import "./reset-css.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { injectCustomIcon } from "./components/template/sign-in-icon/CustomIcon";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          footer: "hidden",
          socialButtonsProviderIcon: {
            display: "none",
          },
        },
      }}
      localization={{
        socialButtonsBlockButton: "Sign in with UM digital identity",
      }}
    >
      <AppRouter />
    </ClerkProvider>
  </React.StrictMode>
);

document.addEventListener("DOMContentLoaded", injectCustomIcon);
