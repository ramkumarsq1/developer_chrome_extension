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

const requests = [];

// Helper function to make data serializable
function serializeRequest(request) {
  return {
    id: request.id,
    url: request.url,
    method: request.method,
    requestBody: request.requestBody ? JSON.stringify(request.requestBody) : null,
    responseBody: request.responseBody ? JSON.stringify(request.responseBody) : null
  };
}

// Convert raw request body to a string if it's binary
function processRequestBody(rawBody) {
  if (rawBody && rawBody.length > 0) {
    try {
      const decoder = new TextDecoder("utf-8");
      return rawBody.map(part => part.bytes ? decoder.decode(new Uint8Array(part.bytes)) : part.text || '').join('');
    } catch (e) {
      console.error("Error processing request body:", e);
      return '[Error decoding body]';
    }
  }
  return 'No request body';
}

// Handle POST requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === 'GET') {
      const requestBody = details.requestBody ? processRequestBody(details.requestBody.raw) : 'No request body';
      const request = {
        id: details.requestId,
        url: details.url,
        method: details.method,
        requestBody: requestBody,
        responseBody: null // Placeholder for response body
      };
      requests.push(serializeRequest(request));
      chrome.storage.local.set({ requests: requests });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.method === 'GET') {
      requests.forEach((req) => {
        if (req.id === details.requestId) {
          req.responseBody = details.responseBody ? processRequestBody(details.responseBody.raw) : 'No response body';
          chrome.storage.local.set({ requests: requests.map(serializeRequest) });
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// chrome.webRequest.onErrorOccurred.addListener(
//   function(details) {
//     console.error('onErrorOccurred:', details);
//   },
//   { urls: ["<all_urls>"] }
// );
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    // Clear all storage (localStorage, chrome.storage.local) and reload the page in the active tab
    clearAllStorageAndReload(tab);
  });
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused (the user has switched away from the Chrome window)
    return;
  }
  chrome.tabs.query({ active: true, windowId: windowId }, function(tabs) {
    if (tabs.length > 0) {
      // Clear all storage and reload the URL in the active tab when focus changes
      clearAllStorageAndReload(tabs[0]);
    }
  });
});

// Function to clear all storage (localStorage and chrome.storage.local) and reload the page in the active tab
function clearAllStorageAndReload(tab) {
  if (tab && tab.url) {
    // Clear chrome.storage.local first
    chrome.storage.local.clear(function() {
      console.log('chrome.storage.local cleared');
      
      // Now, clear the tab's localStorage and reload the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Clear the localStorage in the context of the tab
          localStorage.clear();
          // Reload the page
          location.reload();
        }
      });
    });
  }
}

