const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.classList.toggle("light-mode", theme === "light");
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "✹" : "☽";
  }
  window.dispatchEvent(
    new CustomEvent("themechange", { detail: { light: theme === "light" } }),
  );
}

applyTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.classList.contains("light-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
}
