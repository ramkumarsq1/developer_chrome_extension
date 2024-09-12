const networkData = {}; // To hold unique data per tab

const queryParam = "atala_docurl";

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "GET") {
      const url = new URL(details.url);
      const paramExist = url.searchParams.get(queryParam);

      if (paramExist) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;
          if (!networkData[tabId]) {
            networkData[tabId] = {}; 
          }
          if (!networkData[tabId][paramExist]) {
            networkData[tabId][paramExist] = { url: url.href, statusCode: null, error: null };
            chrome.storage.local.set({ networkData: networkData });
          }
        });
      }
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const tabId = details.tabId;
    chrome.storage.local.get('networkData', (data) => {
      const updatedData = data.networkData || {};
      if (updatedData[tabId] && updatedData[tabId][details.requestId]) {
        updatedData[tabId][details.requestId].statusCode = details.statusCode;
        chrome.storage.local.set({ networkData: updatedData });
      }
    });
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const tabId = details.tabId;
    chrome.storage.local.get('networkData', (data) => {
      const updatedData = data.networkData || {};
      if (updatedData[tabId] && updatedData[tabId][details.requestId]) {
        updatedData[tabId][details.requestId].error = details.error;
        chrome.storage.local.set({ networkData: updatedData });
      }
    });
  },
  { urls: ["<all_urls>"] }
);

// Clear data for inactive tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  const newTabId = activeInfo.tabId;
  chrome.storage.local.get('networkData', (data) => {
    const updatedData = data.networkData || {};
    for (const tabId in updatedData) {
      if (parseInt(tabId) !== newTabId) {
        delete updatedData[tabId];
      }
    }
    chrome.storage.local.set({ networkData: updatedData });
  });
});
