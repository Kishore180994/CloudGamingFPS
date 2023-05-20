/**
 * @author Chandra Kishore Danduri
 * @email chandra.kishore180994@gmail.com
 * @create date 2023-05-20 14:30:12
 * @modify date 2023-05-20 14:30:12
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

/* This code is adding a listener to the `chrome.runtime` object to listen for messages sent from the
extension's background script. When a message with the action "toggleContentScript" is received, it
toggles the display of an element with the ID "cloud-gaming-fps" by changing its CSS `display`
property from "none" to "block" or vice versa. This allows the extension to show or hide the content
script's UI based on user interaction with the extension's popup or other UI elements. */
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

/**
 * This function handles changes in fullscreen mode by appending or moving the root element.
 */
function handleFullscreenChange() {
  const isFullscreen = document.fullscreenElement !== null;

  chrome.storage.local.get(["visible"], function (result) {
    if (result.visible) {
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
    } else {
      root.style.display = "none";
    }
  });
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
