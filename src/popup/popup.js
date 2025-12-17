document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content");

  chrome.storage.local.get(
    ["pubmedStudies", "bookmarkedStudies"],
    (res) => {
      const studies = res.pubmedStudies || [];
      const bookmarks = new Set(res.bookmarkedStudies || []);

      if (studies.length === 0) {
        container.innerHTML = "<p>No studies found.</p>";
        return;
      }

      container.innerHTML = "";

      studies.forEach((study) => {
        const card = document.createElement("div");
        card.className = "study-card";

        const isBookmarked = bookmarks.has(study.id);

        card.innerHTML = `
          <div class="study-header">
            <a
              class="study-title study-link"
              href="https://pubmed.ncbi.nlm.nih.gov/${study.id}/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${study.title}
            </a>

            <button class="bookmark-btn">
              ${isBookmarked ? "★" : "☆"}
            </button>
          </div>

          <div class="study-meta">
            ${study.journal} (${study.year})
          </div>

          <details>
            <summary>Read abstract</summary>
            <div class="study-abstract">
              ${study.abstract}
            </div>
          </details>
        `;

        const bookmarkBtn = card.querySelector(".bookmark-btn");

        bookmarkBtn.addEventListener("click", () => {
          if (bookmarks.has(study.id)) {
            bookmarks.delete(study.id);
          } else {
            bookmarks.add(study.id);
          }

          chrome.storage.local.set({
            bookmarkedStudies: Array.from(bookmarks),
          });

          bookmarkBtn.textContent = bookmarks.has(study.id)
            ? "★"
            : "☆";
        });

        container.appendChild(card);
      });
    }
  );
});
