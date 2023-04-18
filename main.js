let className = '';
let classNum = '';
let department = '';
const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
function parseName() {
    className = document.getElementById('courseName').value;
    classNum = document.getElementById('courseNum').value;
    department = document.getElementById('courseField').value;
    console.log(department, classNum, className);
    if(department.length > 3) {
        alert("Invalid Department");
        return;
    }
}