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
    const fileInput = await fetch('https://github.com/DereC4/ut-grade-viewer/blob/master/data/2022%20Fall.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
       .then(response => response.json())
       .then(response => console.log(JSON.stringify(response)))
    console.log(fileInput);
    let gradeObj = [];
    // PapaParse.parse(

    // );
}