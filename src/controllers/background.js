/**
 * Background script for managing extension state
 */

let currentStatus = null;

const ICON_PATHS = {
  active: "src/views/icons/icon48.png",
  inactive: "src/views/icons/icon48.png",
};

function resetStatus() {
  currentStatus = {
    hasRecaptchaV2: false,
    hasRecaptchaV3: false,
    url: "",
    details: {
      v2: [],
      v3: [],
    },
  };
  updateIcon(currentStatus);
}

function updateIcon(status) {
  const iconPath =
    status.hasRecaptchaV2 || status.hasRecaptchaV3
      ? ICON_PATHS.active
      : ICON_PATHS.inactive;

  chrome.action.setIcon({ path: iconPath });
}

async function triggerScan() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) return null;

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "TRIGGER_SCAN",
    });

    if (response) {
      currentStatus = response;
      updateIcon(currentStatus);
    }

    return response;
  } catch (error) {
    console.error("Failed to trigger scan:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "RECAPTCHA_STATUS":
      currentStatus = message.data;
      updateIcon(currentStatus);
      break;
    case "GET_STATUS":
      sendResponse(currentStatus);
      break;
    case "TRIGGER_SCAN":
      triggerScan().then((result) => sendResponse(result));
      return true;
  }
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    triggerScan();
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  resetStatus();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  resetStatus();
});

resetStatus();
