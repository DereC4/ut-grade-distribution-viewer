const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
function parseName() {
    let className = '';
    let classNum = '';
    let department = '';
    className = document.getElementById('courseName').value;
    classNum = document.getElementById('courseNum').value;
    department = document.getElementById('courseField').value;
    if(department.length > 3) {
        alert("Invalid Department");
        return;
    } 
    if(className == '' && classNum == '' && department == '') {
        alert("At least fill out the form...");
        return;
    }
    if(className == '' || classNum == '' || department == '') {
        alert("Missing something?");
        return;
    }
    console.log(department, classNum, className);
    PapaParse(department, classNum, className);
}

async function PapaParse(department, num, name) {
    const fileInput = await fetch('https://download1528.mediafire.com/2urg1chkmmyg2MXF2FeuX_gnvdJxMBwuNnNr-SUCCZLv1FOIOTH9Y6U4FR-w24CtcqzcHFxHmJdUGz84Nrc-yDdHzQ/5y6373ecv458os9/Fall2022.csv');

    console.log(fileInput);
    let gradeObj = [];
    // PapaParse.parse(

    // );
}