document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content");

  chrome.storage.local.get("pubmedStudies", (res) => {
    const studies = res.pubmedStudies || [];

    if (studies.length === 0) {
      container.innerHTML = "<p>No studies found.</p>";
      return;
    }

    container.innerHTML = "";

    studies.forEach(study => {
      const card = document.createElement("div");
      card.className = "study-card";

      card.innerHTML = `
        <h3>${study.title}</h3>
        <p><strong>${study.journal}</strong> (${study.year})</p>
        <details>
          <summary>Read abstract</summary>
          <p>${study.abstract}</p>
        </details>
      `;

      container.appendChild(card);
    });
  });
});
