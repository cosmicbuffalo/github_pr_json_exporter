document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-token-btn");
  const resetButton = document.getElementById("reset-token-btn");
  const tokenInput = document.getElementById("token-input");
  const statusMsg = document.getElementById("status-msg");
  const tokenInfo = document.getElementById("token-info");

  chrome.storage.local.get(["githubToken"], (result) => {
    if (result.githubToken) {
      tokenInfo.textContent = "A GitHub token is already saved.";
      tokenInput.style.display = "none";
      saveButton.style.display = "none";
      resetButton.style.display = "inline-block";
    } else {
      tokenInfo.textContent = "No token found. Please enter your GitHub token below.";
      tokenInput.style.display = "block";
      saveButton.style.display = "inline-block";
      resetButton.style.display = "none";
    }
  });

  saveButton.addEventListener("click", () => {
    const token = tokenInput.value.trim();

    if (token) {
      saveButton.disabled = true;
      saveButton.textContent = "Saving...";

      chrome.storage.local.set({ githubToken: token }, () => {
        statusMsg.textContent = "Token saved successfully!";
        statusMsg.className = "success";

        tokenInfo.textContent = "A GitHub token is already saved.";
        tokenInput.style.display = "none";
        saveButton.style.display = "none";
        resetButton.style.display = "inline-block";

        saveButton.disabled = false;
        saveButton.textContent = "Save Token";
      });
    } else {
      statusMsg.textContent = "Please enter a valid token.";
      statusMsg.className = "error";
    }
  });

  resetButton.addEventListener("click", () => {
    chrome.storage.local.remove("githubToken", () => {
      statusMsg.textContent = "Token has been reset.";
      statusMsg.className = "success";

      tokenInfo.textContent = "No token found. Please enter your GitHub token below.";
      tokenInput.style.display = "block";
      saveButton.style.display = "inline-block";
      resetButton.style.display = "none";
      tokenInput.value = "";
    });
  });
});
