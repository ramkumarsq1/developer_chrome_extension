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
