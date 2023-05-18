/**
 * Author: Chandra Kishore Danduri
 *
 * This is a script to manage the background functionality of a Chrome Extension.
 * It imports a utility function called `reloadOnUpdate` to automatically reload the extension
 * when changes are made to certain files. This is particularly useful during development.
 *
 * It listens to various events triggered by the extension and performs the necessary actions.
 */

// Import the `reloadOnUpdate` function.
// It reloads the extension when the referenced file is updated.
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

// Listen for updates to these files and reload the extension when they change.
// The pages/background file contains the core functionality of the extension.
reloadOnUpdate("pages/background");

// The pages/content/style.scss file contains the CSS for the content script.
// If you're not using CSS in the content script, you can delete this line.
reloadOnUpdate("pages/content/style.scss");

export {};

// Setting the initial state when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  const state = {
    _fps_counter: 0,
    isVideoElemExist: false,
  };
  chrome.storage.local.set(state);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Storing the state of each tab where the extension is active.
const tabStates: { [key: number]: any } = {};

// Listens for clicks on the extension's icon and toggles the visibility of the content script.
chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;

  if (tabId) {
    if (!tabStates[tabId]) {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["src/pages/content/index.js"],
        },
        () => {
          tabStates[tabId] = { scriptInserted: true, visible: true };
          chrome.action.setBadgeText({ text: "On", tabId: tabId });
        }
      );
    } else {
      chrome.tabs.sendMessage(tabId, { action: "toggleContentScript" });
      tabStates[tabId].visible = !tabStates[tabId].visible;
      chrome.action.setBadgeText({
        text: tabStates[tabId].visible ? "On" : "Off",
        tabId: tabId,
      });
    }
  }
});

// When a tab is updated, it checks if our script should be visible and if so,
// it executes the content script in the tab.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tabStates[tabId] &&
    tabStates[tabId].visible
  ) {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["src/pages/content/index.js"],
      },
      () => {
        // keeping tab state as it was before page refresh
      }
    );
  }
});

// When a tab is closed, it removes the tab's state from the `tabStates` object.
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete tabStates[tabId];
});

// Set the initial badge text to "Off" for all tabs
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    chrome.action.setBadgeText({ text: "Off", tabId: tab.id });
  });
});

let data;

// Listens for messages from content scripts or other parts of the extension,
// storing data or opening the options page as necessary.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "DATA_READY") {
    // Store the data
    data = request.data;
    chrome.runtime.openOptionsPage();
  } else if (request.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
  }
});

// Function to send data to the options page when it is requested.
function sendDataToOptionsPage(port) {
  port.postMessage({ type: "DATA_READY", data: data });
}

// Listen for connections from the options page, sending data when it connects
// and whenever it sends a message requesting the data.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "OPTIONS_PAGE") {
    // Send the data when the options page connects
    sendDataToOptionsPage(port);

    // Also send the data whenever it changes
    port.onMessage.addListener((request) => {
      if (request.type === "DATA_READY") {
        sendDataToOptionsPage(port);
      }
    });
  }
});
