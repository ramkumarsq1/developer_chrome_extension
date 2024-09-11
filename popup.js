document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.getElementById("image-container");
  const iframeContainer = document.getElementById("iframe-container");
  const refreshButton = document.getElementById("refresh");
  const extractIframeButton = document.getElementById("extract-iframe");

  function updateImages() {
    chrome.storage.local.get(["extractedImages"], function (result) {
      const images = result.extractedImages || [];
      imageContainer.innerHTML = ""; // Clear previous content.

      if (images.length === 0) {
        imageContainer.innerHTML = "No images found!";
      } else {
        images.forEach((imgSrc) => {
          const imgElement = document.createElement("img");
          imgElement.src = imgSrc;
          imageContainer.appendChild(imgElement);
        });
      }
    });
  }

  function extractIframe() {
    // Clear previous content
    iframeContainer.innerHTML = "";

    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;

        // Execute script in the context of the current tab using chrome.scripting.executeScript
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            function: getIframeHtml,
          },
          function (results) {
            if (results && results[0]) {
              iframeContainer.innerHTML = results[0].result; // Display the iframe HTML
            } else {
              iframeContainer.innerHTML = "No iframe found!";
            }
          }
        );
      }
    });
  }

  // Function to be injected into the webpage
  function getIframeHtml() {
    const iframe = document.querySelector("iframe");
    console.log(iframe);
    return iframe ? iframe.outerHTML : "No iframe found!";
  }

  refreshButton.addEventListener("click", updateImages);
  extractIframeButton.addEventListener("click", extractIframe);

  updateImages(); // Load images when the popup is opened.
});
// ====
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['requests'], function(result) {
    const requestList = document.getElementById('request-list');
    const requests = result.requests || [];

    console.log(requests)

    // Flag to check if any matching requests are found
    let foundMatchingRequests = false;

    if (requests.length === 0) {
      requestList.innerHTML = '<p>No requests found.</p>';
    } else {
      requests.forEach((request) => {
        // Check if the request URL contains 'auid'
        const url = new URL(request.url);
        const queryParams = Array.from(url.searchParams.entries());
        const hasAuid = queryParams.some(([key]) => key === 'atala_docurl');

        if (hasAuid) {
          foundMatchingRequests = true;
          const div = document.createElement('div');
          div.className = 'request';

          // Extract and format query string parameters
          let queryParamsHTML = '<strong>Query String:</strong> <pre>' + url.search + '</pre><br>';

          // Define the keys you are interested in
          const keysOfInterest = ['atala_docurl']; // Add more keys if needed

        //   let keyValuesHTML = '<strong>Specific Query Parameters:</strong><ul>';
        //   queryParams.forEach(([key, value]) => {
        //     if (keysOfInterest.includes(key)) {
        //       keyValuesHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        //     }
        //   });
        //   keyValuesHTML += '</ul>';

        let keyValuesHTML = '<strong>Specific Query Parameters:</strong><ul>';

        for (const [key, value] of queryParams) {
        if (keysOfInterest.includes(key)) {
            keyValuesHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            break; // Exit the loop after the first match
        }
        }

        keyValuesHTML += '</ul>';


          // Display request body and response body
          let requestBody = request.requestBody || 'No request body';
          let responseBody = request.responseBody || 'No response body';

          div.innerHTML = `
            ${keyValuesHTML} <br>
          `;
        //   div.innerHTML = `
        //     <strong>URL:</strong> ${request.url} <br>
        //     ${queryParamsHTML} 
        //     ${keyValuesHTML} <br>
        //     <strong>Method:</strong> ${request.method} <br>
        //     <strong>Request Body:</strong> <pre>${requestBody}</pre> <br>
        //     <strong>Response Body:</strong> <pre>${responseBody}</pre> <br>
        //   `;
          requestList.appendChild(div);
        }
      });

      if (!foundMatchingRequests) {
        requestList.innerHTML = '<p>No specified URLs with the given key were found.</p>';
      }
    }
  });
});


// =======
document.getElementById('extract-iframe').addEventListener('click', function() {
  // Access the iFrame content
  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');

  if (iframe) {
    try {
      // Get the contentDocument of the iFrame
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      console.log(iframe.contentDocument)
      console.log(iframe.contentWindow.document)

      // Find the element with ID 'hello'
      const helloElement = iframeDocument.getElementById('hello');
      console.log(helloElement)
      // Check if the element exists
      if (helloElement) {
        // Get the HTML of the element
        const helloHTML = helloElement.outerHTML;

        // Display the HTML in the 'output' div
        document.getElementById('output').innerText = helloHTML;
      } else {
        document.getElementById('output').innerText = 'Element with ID "hello" not found.';
      }
    } catch (error) {
      console.error('Error accessing iFrame content:', error);
      document.getElementById('output').innerText = 'Error accessing iFrame content.';
    }
  } else {
    document.getElementById('output').innerText = 'iFrame not found.';
  }
});