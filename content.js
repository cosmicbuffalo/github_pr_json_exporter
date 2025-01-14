async function fetchWithAuth(url, token) {
  return fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
}

// Helper function to fetch all paginated data
async function fetchAllPages(url, token) {
  let page = 1;
  const perPage = 100;  // GitHub's max per page
  let results = [];
  let hasMore = true;

  while (hasMore) {
    const pagedUrl = `${url}?per_page=${perPage}&page=${page}`;
    const response = await fetchWithAuth(pagedUrl, token);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    results = results.concat(data);

    // If less than 100 items are returned, we've reached the last page
    hasMore = data.length === perPage;
    page++;
  }

  return results;
}

(async function () {
  chrome.storage.local.get(["githubToken"], async (result) => {
    const token = result.githubToken;

    if (!token) {
      alert("Please enter your GitHub Token in the extension popup.");
      return;
    }

    const prUrlMatch = window.location.href.match(
      /github\.com\/(.+?)\/(.+?)\/pull\/(\d+)/
    );
    if (!prUrlMatch) {
      alert("Not a valid PR page.");
      return;
    }

    const [_, owner, repo, prNumber] = prUrlMatch;

    // API Endpoints
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const filesUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`;
    const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/commits`;
    const reviewCommentsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`;
    const prReviewsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`;

    try {
      // Fetch all paginated data concurrently
      const [prRes, filesData, commitsData, reviewCommentsData, prReviewsData] = await Promise.all([
        fetchWithAuth(apiUrl, token),
        fetchAllPages(filesUrl, token),
        fetchAllPages(commitsUrl, token),
        fetchAllPages(reviewCommentsUrl, token),
        fetchAllPages(prReviewsUrl, token),
      ]);

      if (!prRes.ok) {
        throw new Error(`GitHub API error: ${prRes.status}`);
      }

      const prData = await prRes.json();

      // Combine all data
      const fullPRData = {
        ...prData,
        files: filesData,
        commits: commitsData,
        review_comments: reviewCommentsData,
        pr_reviews: prReviewsData,
      };

      // Send data to background script for download
      chrome.runtime.sendMessage(
        {
          type: "download",
          data: fullPRData,
          filename: `PR-${prNumber}.json`,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message failed:", chrome.runtime.lastError.message);
          } else {
            console.log("Download message sent successfully.");
          }
        }
      );
    } catch (error) {
      console.error("Error fetching PR data:", error);
      alert("Failed to fetch PR data. Check your token and permissions.");
    }
  });
})();
