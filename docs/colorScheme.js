const colorToggle = document.getElementById("colorToggle")
colorToggle.addEventListener("change", () => {
  const darkModeEnabled = document.body.classList.toggle("dark");
  Chart.defaults.global.defaultFontColor = darkModeEnabled ? "#484b6a" : "#F8F0E5";
  // Chart.defaults.plugins.legend.labels.color = isDarkModeEnabled ? "#484b6a" : "#F8F0E5";
  Chart.helpers.each(Chart.instances, (instance) => {
    instance.chart.update();
  });
})