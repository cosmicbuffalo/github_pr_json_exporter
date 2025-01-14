(async function () {
  chrome.storage.local.get(["githubToken"], async (result) => {
    const token = result.githubToken;

    const prUrlMatch = window.location.href.match(/github\.com\/(.+?)\/(.+?)\/pull\/(\d+)/);
    if (!prUrlMatch) {
      alert("Not a valid PR page.");
      return;
    }

    const [_, owner, repo, prNumber] = prUrlMatch;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const filesUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`;
    const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/commits`;
    const reviewCommentsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`;
    const prReviewsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`;

    async function fetchAllPages(url, token) {
      let page = 1;
      const perPage = 100;
      let results = [];
      let hasMore = true;

      while (hasMore) {
        const pagedUrl = `${url}?per_page=${perPage}&page=${page}`;
        const response = await fetch(pagedUrl, {
          headers: { Authorization: `token ${token}` }
        });

        const data = await response.json();
        results = results.concat(data);
        hasMore = data.length === perPage;
        page++;
      }

      return results;
    }

    try {
      const [
        prRes,
        filesData,
        commitsData,
        reviewCommentsData,
        prReviewsData,
      ] = await Promise.all([
        fetch(apiUrl, { headers: { Authorization: `token ${token}` } }).then(res => res.json()),
        fetchAllPages(filesUrl, token),
        fetchAllPages(commitsUrl, token),
        fetchAllPages(reviewCommentsUrl, token),
        fetchAllPages(prReviewsUrl, token),
      ]);

      const fullPRData = {
        ...prRes,
        files: filesData,
        commits: commitsData,
        review_comments: reviewCommentsData,
        pr_reviews: prReviewsData,
      };

      const blob = new Blob([JSON.stringify(fullPRData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PR-${prNumber}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Notify the content script that the download is complete
      chrome.runtime.sendMessage({ type: "downloadComplete" });
    } catch (error) {
      console.error("Error fetching PR data:", error);
      alert("Failed to fetch PR data.");
      // Notify the content script that the download is complete
      chrome.runtime.sendMessage({ type: "downloadComplete" });
    }
  });
})();
