/**
 * Author: Chandra Kishore Danduri
 */
import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../../../../redux/store";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "cloud-gaming-fps";
document.body.append(root);

createRoot(root).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleContentScript") {
    // Toggle the display of the element
    const element = document.getElementById("cloud-gaming-fps");
    if (element) {
      element.style.display =
        element.style.display === "none" ? "block" : "none";
    }
  }
});

function handleFullscreenChange() {
  const isFullscreen = document.fullscreenElement !== null;

  if (isFullscreen) {
    // When entering fullscreen, append the extension root element to the fullscreen container
    document.fullscreenElement.append(root);

    // Make sure the root element is visible and positioned correctly
    root.style.display = "block";
    root.style.position = "absolute";
    root.style.zIndex = "10000"; // Choose a high value to ensure it's on top of the video
  } else {
    // When exiting fullscreen, move the root element back to the body
    document.body.append(root);
  }
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
