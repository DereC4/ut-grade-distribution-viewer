const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
var chartDiv = document.querySelector('#grades');
if(chartDiv.getAttribute('value') == 'invisible'){
    chartDiv.style.display = 'none';
}
var gradeChart;
const ctx = document.getElementById("gradeBar");

/*
 Parse the name
*/
function parseName() {
    let className = document.getElementById('courseName').value;
    let classNum = document.getElementById('courseNum').value;
    let department = document.getElementById('courseField').value;
    if(!className && !classNum && !department) {
        alert("At least fill out the form...");
        return;
    }
    if(department.length != 3) {
        alert("Invalid Department");
        return;
    } 
    if(className == '' || department == '') {
        return;
    }
    console.log(department, classNum, className);
    PapaParse(department, classNum, className);
}

async function PapaParse(department, num, name) {
    let cData = '';
    // await fetch('https://derec4.github.io/UT-Grade-Dist/2022prefixes.json');
    await fetch('https://derec4.github.io/UT-Grade-Dist/2022%20Fall.json')
    .then(res => res.json())
    .then(data => {
        cData = data;
     })
    .then(() => {
    //   console.log(cData);
     });
    
    if(cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase())).length == 0) {
        alert("Invalid Prefix");
        return;
    }  
    const selectedClass = '';
    if(cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase()))
            .filter(cData => cData["Course Number"].includes(num.toUpperCase))
            .filter(cData => cData["Course Title"].includes(name.toUpperCase())).length == 0) {
        // Possible that the class name was typed wrong; try again with just the course number
        selectedClass = cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase()))
                             .filter(cData => cData["Course Title"].includes(name.toUpperCase()));
    } else {
        selectedClass = cData.filter(cData => cData["Course Prefix"].includes(department.toUpperCase()))
                             .filter(cData => cData["Course Number"].includes(num.toUpperCase))
                             .filter(cData => cData["Course Title"].includes(name.toUpperCase()))
    }

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
    if(gradeChart) {
        gradeChart.config.data = {
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
                borderWidth: 2,
                // borderColor: '#36A2EB',
                backgroundColor: ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""],
            }]
            };
        gradeChart.update();
    } else {
        loadChart(gradeDist);
        chartDiv.style.display = '';
    }
}

function loadChart(gradeDist) {
    gradeChart = new Chart(ctx, {
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
            borderWidth: 2,
            backgroundColor: ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""],
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                stacked: true,
                grid: {
                  display: true,
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
        }
    });    
}
