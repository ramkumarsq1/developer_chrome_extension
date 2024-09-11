// async function extractImages() {
//   let images = [];

//   //   .atala_page_image_anchor
//   //   .atala_page_image

//   function extractFromElement(element) {
//     // const imgTags = element.querySelectorAll(
//     //   ".document__page__image.ng-star-inserted"
//     // );
//     // const imgTags = element.querySelectorAll(
//     //   ".atala_page_image_anchor .atala_page_image"
//     // );
//     const imgTags = element.querySelectorAll("iframe");
//     // console.log(imgTags);
//     imgTags.forEach((img) => {
//       const imgSrc = img.src || img.dataset.src; // Use either src or dataset.src.
//       if (imgSrc && !images.includes(imgSrc)) {
//         images.push(imgSrc);
//       }
//     });

//     // Extract from <canvas> elements if present.
//     const canvases = element.querySelectorAll("canvas");
//     canvases.forEach((canvas) => {
//       try {
//         const imgData = canvas.toDataURL();
//         if (!images.includes(imgData)) {
//           images.push(imgData);
//         }
//       } catch (e) {
//         console.log("Error extracting image from canvas:", e);
//       }
//     });
//   }

//   // Initial extraction
//   extractFromElement(document);

//   // Observe changes and perform extraction when new content is loaded.
//   const observer = new MutationObserver(() => {
//     extractFromElement(document);
//     // Save the updated images to storage
//     chrome.storage.local.set({ extractedImages: images });
//   });

//   observer.observe(document.body, { childList: true, subtree: true });

//   // Listen for scroll events to trigger extraction.
//   window.addEventListener("scroll", () => {
//     extractFromElement(document);
//     // Save the updated images to storage
//     chrome.storage.local.set({ extractedImages: images });
//   });

//   // Save the initial images to Chrome’s local storage.
//   chrome.storage.local.set({ extractedImages: images });
// }

// // Run the image extraction function.
// extractImages();
