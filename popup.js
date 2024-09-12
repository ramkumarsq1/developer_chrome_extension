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
            const requestData = tabData[queryParam];
            htmlContent += `
              <div>
                <strong></strong> ${queryParam} <br />
              </div>
              <hr />
            `;
            // htmlContent += `
            //   <div>
            //     <strong>AUID:</strong> ${queryParam} <br />
            //     <strong>URL:</strong> ${requestData.url} <br />
            //     <strong>Status Code:</strong> ${requestData.statusCode || 'N/A'} <br />
            //     <strong>Error:</strong> ${requestData.error || 'N/A'} <br />
            //   </div>
            //   <hr />
            // `;
        }
        });
      });
  
      if (htmlContent) {
        content.innerHTML = htmlContent;
      } else {
        content.textContent = 'No unique GET requests with your parameter found for this tab.';
      }
    });
  });
  