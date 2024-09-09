chrome.runtime.onInstalled.addListener(() => {
    console.log('Image Extractor Extension installed');
});

// Listener for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshImages') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['content.js']
        });
    }
});
