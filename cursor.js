const cursor = document.createElement("div");
cursor.id = "customCursor";
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
