// document.addEventListener('DOMContentLoaded', () => {
//     chrome.storage.local.get('networkData', (data) => {
//       const content = document.getElementById('content');
//       const networkData = data.networkData || {};
//       const uniqueQueryParams = new Set();
//       let htmlContent = '';
  
//       Object.values(networkData).forEach(tabData => {
//         Object.keys(tabData).forEach(queryParam => {
//           if (!uniqueQueryParams.has(queryParam)) {
//             uniqueQueryParams.add(queryParam);
//             const requestData = tabData[queryParam];
//             htmlContent += `
//               <div>
//                 <strong></strong> ${queryParam} <br />
//               </div>
//               <hr />
//             `;
//             // htmlContent += `
//             //   <div>
//             //     <strong>AUID:</strong> ${queryParam} <br />
//             //     <strong>URL:</strong> ${requestData.url} <br />
//             //     <strong>Status Code:</strong> ${requestData.statusCode || 'N/A'} <br />
//             //     <strong>Error:</strong> ${requestData.error || 'N/A'} <br />
//             //   </div>
//             //   <hr />
//             // `;
//         }
//         });
//       });
  
//       if (htmlContent) {
//         content.innerHTML = htmlContent;
//       } else {
//         content.textContent = 'No unique GET requests with your parameter found for this tab.';
//       }
//     });
//   });
  

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('networkData', (data) => {
    const content = document.getElementById('content');
    const networkData = data.networkData || {};
    const uniqueQueryParams = new Set();
    let htmlContent = '';

    Object.values(networkData).forEach(tabData => {
      Object.keys(tabData).forEach(queryParam => {
        if (!uniqueQueryParams.has(queryParam)) {
          uniqueQueryParams.add(queryParam);
          htmlContent += `
            <div>
              <strong style="color:#565656;">PDF:</strong> ${queryParam} 
              <span class="copy-button" data-copy="${queryParam}">
                <img class="copy-icon" src="icons/copy.png" alt="copy" style="width:15px; margin:0;margin-bottom: -3px;"/>
              </span>
              <br />
            </div>
          `;
        }
      });
    });

    if (htmlContent) {
      content.innerHTML = htmlContent;

      // Add copy functionality to each copy-button
      content.addEventListener('click', (event) => {
        if (event.target.classList.contains('copy-icon')) {
          const textToCopy = event.target.parentElement.getAttribute('data-copy');
          navigator.clipboard.writeText(textToCopy).then(() => {
            // Change icon to indicate success
            const icon = event.target;
            icon.src = 'icons/copied.png'; // Path to the copied state icon
            // icon.style='width:10px'
            // Provide feedback or reset the icon
            setTimeout(() => {
              icon.src = 'icons/copy.png'; // Path to the original icon
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      });
    } else {
      content.textContent = 'No unique GET requests with your parameter found for this tab.';
    }
  });
});



