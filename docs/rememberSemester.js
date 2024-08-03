document.addEventListener('DOMContentLoaded', function() {
    const savedSemester = sessionStorage.getItem('selectedSemester');
    if (savedSemester) {
      document.getElementById('semester').value = savedSemester;
    }
  
    // Save the selected semester to sessionStorage on change
    document.getElementById('semester').addEventListener('change', function() {
      sessionStorage.setItem('selectedSemester', this.value);
    });
  });
  