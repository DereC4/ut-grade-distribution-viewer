const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
function parseName() {
    let className = '';
    let classNum = '';
    let department = '';
    className = document.getElementById('courseName').value;
    // classNum = document.getElementById('courseNum').value;
    department = document.getElementById('courseField').value;
    if(department.length > 3) {
        alert("Invalid Department");
        return;
    } 
    if(className == '' && department == '') {
        alert("At least fill out the form...");
        return;
    }
    if(className == '' || department == '') {
        alert("Missing something?");
        return;
    }
    console.log(department, 0, className);
    PapaParse(department, 0, className);
}

async function PapaParse(department, num, name) {
    let cData = '';
    await fetch('https://derec4.github.io/UT-Grade-Dist/2022%20Fall.json')
    .then(res => res.json())
    .then(data => {
        cData = data;
     })
    .then(() => {
      console.log(cData);
     });
    // await fetch('/data/2022 Fall.json')
    // .then(res => res.json())
    // .then(data => {
    //     cData = data;
    //  })
    // .then(() => {
    //   console.log(cData);
    //  });
    const selectedClass = cData.filter(cData => cData["Course Title"].includes(name.toUpperCase()));
    console.log(selectedClass);
    let gradeDist = { 
        "A": 0,
        'A-': 0,
        'B+': 0,
        'B': 0,
        'B-': 0,
        'C+': 0,
        'C': 0,
        'C-': 0,
        'Other': 0
    };
    for(i in selectedClass) {
        console.log(selectedClass[i]["Letter Grade"]);
    }
}