// Save the entered GitHub token
document.getElementById('save-token-btn').addEventListener('click', () => {
  const pat = document.getElementById('pat-input').value;
  if (pat) {
    chrome.storage.local.set({ githubToken: pat }, () => {
      alert('GitHub Token saved successfully!');
    });
  } else {
    alert('Please enter a valid token.');
  }
});

// Trigger the download
document.getElementById('download-btn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
