function insertDownloadButton() {
  const editButtonSelector = ".gh-header-actions > button.js-details-target";
  const buttonContainer =
    document.querySelector(editButtonSelector).parentElement;

  if (buttonContainer && !document.getElementById("export-pr-json-btn")) {
    const downloadButton = document.createElement("button");
    downloadButton.id = "export-pr-json-btn";
    downloadButton.textContent = "JSON Export";
    downloadButton.className = "btn btn-sm flex-md-order-2";

    downloadButton.onclick = handleDownloadClick;

    buttonContainer.insertBefore(downloadButton, buttonContainer.children[2]);
  }
}

function openPopupMessage(message) {
  alert(message + "\nClick the extension icon to open the setup.");
}

function setButtonLoadingState(isLoading) {
  const downloadButton = document.getElementById("export-pr-json-btn");
  if (downloadButton) {
    if (isLoading) {
      downloadButton.disabled = true;
      downloadButton.style.cursor = "wait";
      downloadButton.classList.add("disabled");
    } else {
      console.log("download complete")
      setTimeout(() => {
        downloadButton.disabled = false;
        downloadButton.style.cursor = "pointer";
        downloadButton.classList.remove("disabled");
      }, 1000);
    }
  }
}

async function handleDownloadClick() {
  chrome.storage.local.get(["githubToken"], async (result) => {
    const token = result.githubToken;

    if (!token) {
      openPopupMessage("Please enter your GitHub Token.");
      return;
    }

    const isValid = await validateToken(token);
    if (!isValid) {
      openPopupMessage("Your GitHub token is invalid or expired. Please update it.");
      return;
    }

    setButtonLoadingState(true);

    chrome.runtime.sendMessage(
      { type: "startDownload", token: token },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error starting download:",
            chrome.runtime.lastError.message,
          );
        } else {
          console.log("Download initiated.");
        }
      },
    );
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "downloadComplete") {
    setButtonLoadingState(false);
  }
});

async function validateToken(token) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.ok;
}

function triggerPRDownload(token) {
  chrome.runtime.sendMessage(
    { type: "startDownload", token: token },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error starting download:",
          chrome.runtime.lastError.message,
        );
      } else {
        console.log("Download initiated.");
      }
    },
  );
}

window.addEventListener("load", insertDownloadButton);

document.addEventListener("pjax:end", insertDownloadButton);
