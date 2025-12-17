document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content");

  chrome.storage.local.get("pubmedStudies", (res) => {
    const studies = res.pubmedStudies || [];

    if (studies.length === 0) {
      container.innerHTML = "<p>No studies found.</p>";
      return;
    }

    container.innerHTML = "";

    studies.forEach((study) => {
      const card = document.createElement("div");
      card.className = "study-card";

      card.innerHTML = `
        <a
          class="study-title study-link"
          href="https://pubmed.ncbi.nlm.nih.gov/${study.id}/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${study.title}
        </a>

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

      container.appendChild(card);
    });
  });
});
