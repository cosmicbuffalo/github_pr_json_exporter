chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startDownload") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["fetch_pr_data.js"]
    });
    sendResponse({ status: "Download started" });
  }
  if (message.type === "downloadComplete") {
    // Relay the message back to the content script
    chrome.tabs.sendMessage(sender.tab.id, { type: "downloadComplete" });
  }
});
