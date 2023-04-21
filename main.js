const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
var barChart = document.querySelector('#grades');
if(barChart.getAttribute('value') == 'invisible'){
    barChart.style.display = 'none';
}

/*
 Parse the name
*/
function parseName() {
    let className = '';
    let classNum = '';
    let department = '';
    className = document.getElementById('courseName').value;
    // classNum = document.getElementById('courseNum').value;
    department = document.getElementById('courseField').value;
    if(department.length > 3) {
        alert("Invalid Prefix");
        return;
    } 
    if(className == '' && department == '') {
        alert("At least fill out the form...");
        return;
    }
    if(className == '' || department == '') {
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
    //   console.log(cData);
     });
    // await fetch('/data/2022 Fall.json')
    // .then(res => res.json())
    // .then(data => {
    //     cData = data;
    //  })
    // .then(() => {
    //   console.log(cData);
    //  });
    if(cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase())).length == 0) {
        alert("Invalid Prefix");
        return;
    }
    const selectedClass = cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase()))
                               .filter(cData => cData["Course Title"].includes(name.toUpperCase()));
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
        'D+': 0,
        'D': 0,
        'D-': 0,
        'F': 0,
        'Other': 0
    };
    for(i in selectedClass) {
        let letterGrade = selectedClass[i]["Letter Grade"];
        let cnt = selectedClass[i]["Count of letter grade"]
        gradeDist[letterGrade] += cnt;
        // console.log(selectedClass[i]["Letter Grade"]);
        // console.log(selectedClass[i]["Count of letter grade"]);
    }
    console.log(gradeDist);
    loadChart(gradeDist);
    barChart.style.display = '';
}
var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};

function loadChart(gradeDist) {
    const ctx = document.getElementById("gradeBar");
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: [           
            'A',
            'A-',
            'B+',
            'B',
            'B-',
            'C+',
            'C',
            'C-',
            'D+',
            'D',
            'D-',
            'F'],
        datasets: [{
            label: 'Grade Distribution',
            data: Object.values(gradeDist),
            borderWidth: 1,
            // borderColor: '#36A2EB',
            backgroundColor: ['rgb(98, 244, 54)', 'rgb(142, 224, 0)', 'rgb(169, 202, 0)', 'rgb(188, 181, 0)', 'rgb(201, 159, 0)', 'rgb(208, 137, 0)', 'rgb(211, 114, 0)', 'rgb(208, 93, 21)', 'rgb(201, 73, 41)', 'rgb(190, 54, 54)'],
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    });    
}
