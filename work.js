const workTabs = document.querySelectorAll(".work-tabs button");
const workProjects = document.querySelectorAll(".work-content article");

function filterProjects(category) {
  workProjects.forEach((project) => {
    const category_list = (project.dataset.category || "").split(/\s+/);
    const show = category === "all" || category_list.includes(category);
    project.classList.toggle("is-hidden", !show);
  });
}


workTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    workTabs.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    filterProjects(btn.textContent.trim().toLocaleLowerCase());
  });
});

//default page
if (workTabs.length) {
  const defaultTab =
    Array.from(workTabs).find(
      (b) => b.textContent.trim().toLocaleLowerCase() === "all",
    ) || workTabs[0];
  defaultTab.classList.add("is-active");
  filterProjects(defaultTab.textContent.trim().toLowerCase());
}
