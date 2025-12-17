document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content");
  const toggleBtn = document.getElementById("themeToggle");

  // 🌙 Load saved theme preference
  chrome.storage.local.get("darkMode", (res) => {
    if (res.darkMode) {
      document.body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    }
  });

  // 🌙 Toggle dark mode
  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    chrome.storage.local.set({ darkMode: isDark });
  });

  // 📚 Load studies + bookmarks
  chrome.storage.local.get(
    ["pubmedStudies", "bookmarkedStudies"],
    (res) => {
      const studies = res.pubmedStudies || [];
      const bookmarks = new Set(res.bookmarkedStudies || []);

      if (studies.length === 0) {
        container.innerHTML = "<p>No studies found.</p>";
        return;
      }

      // 🔹 Derive filter values
      const years = [...new Set(studies.map(s => s.year).filter(Boolean))]
        .sort()
        .reverse();

      const journals = [...new Set(studies.map(s => s.journal).filter(Boolean))]
        .sort();

      // 🔹 Filters
      const filters = document.createElement("div");
      filters.className = "filters";

      filters.innerHTML = `
        <select id="yearFilter">
          <option value="">All Years</option>
          ${years.map(y => `<option value="${y}">${y}</option>`).join("")}
        </select>

        <select id="journalFilter">
          <option value="">All Journals</option>
          ${journals.map(j => `<option value="${j}">${j}</option>`).join("")}
        </select>
      `;

      container.appendChild(filters);

      // 🔍 Search
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "Search studies…";
      searchInput.className = "search-input";
      container.appendChild(searchInput);

      const list = document.createElement("div");
      container.appendChild(list);

      const yearSelect = filters.querySelector("#yearFilter");
      const journalSelect = filters.querySelector("#journalFilter");

      function render(filteredStudies) {
        list.innerHTML = "";

        filteredStudies.forEach((study) => {
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

            bookmarkBtn.textContent = bookmarks.has(study.id) ? "★" : "☆";
          });

          list.appendChild(card);
        });
      }

      function applyFilters() {
        const year = yearSelect.value;
        const journal = journalSelect.value;
        const query = searchInput.value.toLowerCase();

        let filtered = studies;

        if (year) {
          filtered = filtered.filter(s => s.year === year);
        }

        if (journal) {
          filtered = filtered.filter(s => s.journal === journal);
        }

        if (query) {
          filtered = filtered.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.abstract.toLowerCase().includes(query) ||
            s.journal.toLowerCase().includes(query)
          );
        }

        render(filtered);
      }

      yearSelect.addEventListener("change", applyFilters);
      journalSelect.addEventListener("change", applyFilters);
      searchInput.addEventListener("input", applyFilters);

      // Initial render
      render(studies);
    }
  );
});
