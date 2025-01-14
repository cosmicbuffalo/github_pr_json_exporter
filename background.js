chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "download") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: triggerDownload,
      args: [message.data, message.filename]
    });
  }
});

// This function will run in the content script context
function triggerDownload(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
