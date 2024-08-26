import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import AppRouter from "./routing/AppRouter";
import "./reset-css.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { CustomIcon } from "./components/template/sign-in-icon/CustomIcon";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export const injectCustomIcon = () => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const button = document.querySelector(
          ".cl-socialButtonsBlockButton__microsoft"
        );
        if (button) {
          const iconContainer = button.querySelector(".cl-internal-18u6q9q");
          if (iconContainer && !iconContainer.querySelector(".custom-icon")) {
            const customIconContainer = document.createElement("div");
            customIconContainer.className = "custom-icon";

            ReactDOM.createRoot(customIconContainer).render(<CustomIcon />);

            iconContainer.insertBefore(
              customIconContainer,
              iconContainer.firstChild
            );

            customIconContainer.style.width = "32px";
            customIconContainer.style.height = "32px";
            customIconContainer.style.display = "flex";
            customIconContainer.style.alignItems = "center";

            observer.disconnect();
          }
        }
      }
    }
  });

  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });
};

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
