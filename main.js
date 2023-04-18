let className = '';
const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
function parseName() {
    className = document.getElementById('className').value;
    console.log(className);
}