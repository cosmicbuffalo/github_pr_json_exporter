# 🚀 GitHub PR JSON Exporter

A Chrome extension that allows you to download the full JSON payload of a GitHub Pull Request (PR), including commits, files, and review comments—directly from the PR page!

## 📦 Features
- ✅ One-Click Download of the entire PR JSON.
- ✅ Includes Commits, Files, and Review Comments.
- ✅ Native GitHub UI Integration (button next to the Edit and <> Code buttons).
- ✅ Handles Large PRs (auto-fetches paginated data).
- ✅ Token Management (OAuth-ready with token validation).
- ✅ Loading Indicator during downloads.

## 🔧 Installation

1.	Clone the Repository
```
git clone https://github.com/cosmicbuffalo/github_pr_json_exporter.git
```
2.	Load the Extension in Chrome
	-	Go to chrome://extensions/
	-	Enable Developer Mode (top right)
	-	Click Load unpacked and select the project folder
3.	Set Up Your GitHub Token
	-	Click the extension icon in Chrome
    -   Follow the GitHub link to create a new Personal Access Token
	-	Enter your new token into the extension popup

## 🔎 Usage
1.	Navigate to a GitHub Pull Request.
2.	Click the “JSON Export” button next to Edit and <> Code.
3.	The JSON file will download with the full PR data.


## 🤝 Contributing

1.	Fork the repo
2.	Create your feature branch (git checkout -b feature/new-feature)
3.	Commit changes (git commit -m 'Add new feature')
4.	Push to the branch (git push origin feature/new-feature)
5.	Open a Pull Request

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

