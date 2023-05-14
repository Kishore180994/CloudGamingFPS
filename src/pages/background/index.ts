import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

export {};
chrome.runtime.onInstalled.addListener(() => {
  const state = {
    _fps_counter: 0,
    isVideoElemExist: false,
  };
  chrome.storage.local.set(state);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabStates: { [key: number]: any } = {};

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
          // Set badge text to "On"
        }
      );
      chrome.action.setBadgeText({ text: "On", tabId: tabId });
    } else {
      chrome.tabs.sendMessage(tabId, { action: "toggleContentScript" });
      // Toggle badge text between "On" and "Off"
      tabStates[tabId].visible = !tabStates[tabId].visible;
      chrome.action.setBadgeText({
        text: tabStates[tabId].visible ? "On" : "Off",
        tabId: tabId,
      });
    }
  }
});

// Set the initial badge text to "Off"
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    chrome.action.setBadgeText({ text: "Off", tabId: tab.id });
  });
});

let data;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "DATA_READY") {
    // Store the data
    data = request.data;
    chrome.runtime.openOptionsPage();
  }
});

function sendDataToOptionsPage(port) {
  port.postMessage({ type: "DATA_READY", data: data });
}

// Listen for connection from the options page
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
