import ReactDOM from "react-dom/client";
import umIcon from "../../../assets/images/um_icon.png";

const CustomIcon = () => {
  return (
    <img
      src={umIcon}
      alt="UM Icon"
      style={{
        width: "55px",
        height: "50px",
      }}
    />
  );
};

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

            customIconContainer.style.width = "40px";
            customIconContainer.style.height = "32px";
            customIconContainer.style.display = "flex";
            customIconContainer.style.alignItems = "center";

            observer.disconnect();
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};
