const colorToggle = document.getElementById("colorToggle")
colorToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})