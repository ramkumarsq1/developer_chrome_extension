// chrome.runtime.onInstalled.addListener(() => {
//     console.log('Image Extractor Extension installed');
// });

// // Listener for messages from popup
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'refreshImages') {
//         chrome.scripting.executeScript({
//             target: { tabId: sender.tab.id },
//             files: ['content.js']
//         });
//     }
// });
// //Added for post method url
// const requests = [];

// // Helper function to make data serializable
// function serializeRequest(request) {
//   return {
//     id: request.id,
//     url: request.url,
//     method: request.method,
//     requestBody: request.requestBody ? JSON.stringify(request.requestBody) : null,
//     responseBody: request.responseBody ? JSON.stringify(request.responseBody) : null
//   };
// }

// // Convert raw request body to a string if it's binary
// function processRequestBody(rawBody) {
//   if (rawBody && rawBody.length > 0) {
//     try {
//       const decoder = new TextDecoder("utf-8");
//       // Join and decode all parts of the raw body data
//       return rawBody.map(part => {
//         if (part.bytes) {
//           return decoder.decode(new Uint8Array(part.bytes)); // Decode the binary data
//         }
//         return part.text || ''; // Handle cases where the data is already in text format
//       }).join('');
//     } catch (e) {
//       console.error("Error processing request body:", e);
//       return '[Error decoding body]';
//     }
//   }
//   return 'No request body';
// }

// // Handle POST requests
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     if (details.method === 'POST') {
//       const requestBody = details.requestBody ? processRequestBody(details.requestBody.raw) : 'No request body';
//       const request = {
//         id: details.requestId,
//         url: details.url,
//         method: details.method,
//         requestBody: requestBody,
//         responseBody: null // Placeholder for response body
//       };
//       // Add POST request to requests array
//       requests.push(serializeRequest(request));
//       chrome.storage.local.set({ requests: requests });
//     }
//   },
//   { urls: ["<all_urls>"] },
//   ["requestBody"]
// );

// chrome.webRequest.onCompleted.addListener(
//   function(details) {
//     if (details.method === 'POST') {
//       requests.forEach((req) => {
//         if (req.id === details.requestId) {
//           req.responseBody = details.responseBody ? details.responseBody : 'No response body';
//           chrome.storage.local.set({ requests: requests.map(serializeRequest) });
//         }
//       });
//     }
//   },
//   { urls: ["<all_urls>"] }
// );

// chrome.webRequest.onErrorOccurred.addListener(
//   function(details) {
//     console.error('onErrorOccurred:', details);
//   },
//   { urls: ["<all_urls>"] }
// );

const networkData = {}; // To hold unique data per tab

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "GET") {
      const url = new URL(details.url);
      const auid = url.searchParams.get("auid");

      if (auid) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;
          if (!networkData[tabId]) {
            networkData[tabId] = new Map(); // Use a Map to store unique auid URLs
          }
          if (!networkData[tabId].has(auid)) {
            networkData[tabId].set(auid, url.href);
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
    if (networkData[tabId] && networkData[tabId].has(details.requestId)) {
      networkData[tabId].get(details.requestId).statusCode = details.statusCode;
      chrome.storage.local.set({ networkData: networkData });
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const tabId = details.tabId;
    if (networkData[tabId] && networkData[tabId].has(details.requestId)) {
      networkData[tabId].get(details.requestId).error = details.error;
      chrome.storage.local.set({ networkData: networkData });
    }
  },
  { urls: ["<all_urls>"] }
);

// Clear data for inactive tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  const newTabId = activeInfo.tabId;
  chrome.storage.local.get('networkData', (data) => {
    const updatedData = { ...data.networkData };
    for (const tabId in updatedData) {
      if (parseInt(tabId) !== newTabId) {
        delete updatedData[tabId];
      }
    }
    chrome.storage.local.set({ networkData: updatedData });
  });
});
