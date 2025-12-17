document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("content");

  // UI placeholder (what user sees)
  container.innerHTML = `
    <p>No studies available yet.</p>
    <small>Background fetch will be added next.</small>
  `;

  // 🔍 TEMPORARY: verify background → storage → popup flow
  chrome.storage.local.get("testData", (result) => {
    console.log("Popup can read:", result.testData);
  });
});
