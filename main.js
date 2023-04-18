let className = '';
let classNum = '';
let department = '';
const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
function parseName() {
    className = document.getElementById('className').value;
    department = document.getElementById('').value;
    department = document.getElementById('').value;
    console.log(className);
}