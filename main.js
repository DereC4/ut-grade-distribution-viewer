const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
var chartDiv = document.querySelector('#grades');
var aboutDiv = document.querySelector('.bg-text');
if(chartDiv.getAttribute('value') == 'invisible'){
    chartDiv.style.display = 'none';
}
var gradeChart;
const ctx = document.getElementById("gradeBar");

/*
 Parse the input form and class data
*/
async function parseName() {
    let className = document.getElementById('courseName').value.toUpperCase();
    let classNum = document.getElementById('courseNum').value;
    let department = document.getElementById('courseField').value.trim().toUpperCase();
    let semester = document.getElementById('semester').value;
    let departments = '';
    await fetch('https://derec4.github.io/ut-grade-data/2022prefixes.json')
    .then(res => res.json())
    .then(data => { departments = data; });
    if(!className && !classNum && !department) {
        alert("At least fill out the form...");
        return;
    }
    if(!department || !classNum) {
        alert("Missing fields")
        return;
    }
    if(!departments.includes(department)) {
        alert("Invalid Department");
        return;
    } 
    console.log(department, classNum.toString(), className.trim(), sem);
    await PapaParse(department, classNum.toString(), className.trim(), semester);
}

/*
 Fetch the necessary database depending on semester and filter based on the input data
*/
async function PapaParse(department, num, name, sem) {
    let cData = '';
    let url = '';
    switch (sem) {
        case 'f2022':
            url = 'https://derec4.github.io/ut-grade-data/2022%20Fall.json';
            break;
        case 'sum2022':
            url = 'https://derec4.github.io/ut-grade-data/2022%20Summer.json';
            break;
        case 'sp2022':
            // Temp, change when other data sets are added
            url = 'https://derec4.github.io/ut-grade-data/2022%20Spring.json';
            break;
        case 'f2021':
            url = 'https://derec4.github.io/ut-grade-data/2021%20Fall.json';
            break;          
        default:
            url = 'https://derec4.github.io/ut-grade-data/2022%20Fall.json';
            break;
    }
    await fetch(url)
    .then(res => res.json())
    .then(data => { cData = data; });

    let selectedClass = cData.filter(cData => cData["Course Prefix"].includes(department))
                             .filter(cData => cData["Course Number"] == num.toString().toUpperCase())
                             .filter(cData => cData["Course Title"].includes(name));
    if(selectedClass.length == 0) {
        // Possible that the class name was typed wrong; try again with just the course number
        console.log("Invalid name; trying again with just the course number");
        selectedClass = cData.filter(cData => cData["Course Prefix"].includes(department))
                             .filter(cData => cData["Course Number"] == num.toString().toUpperCase());
    } 
    if(selectedClass.length == 0) {
        // Still can't find anything? Just exit without making a chart and alert that nothing could be found
        alert("No data found. Try again :(");
        return;
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
                label: 'Grade distribution for \"' + selectedClass[0]["Course Title"] +"\"",
                data: Object.values(gradeDist),
                borderWidth: 2,
                // borderColor: '#36A2EB',
                backgroundColor: ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""],
            }]
            };
        gradeChart.update();
    } else {
        loadChart(gradeDist, selectedClass[0]["Course Title"]);
        aboutDiv.style.visibility='hidden';
        chartDiv.style.display = '';
    }
}

function loadChart(gradeDist, courseName) {
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
            label: 'Grade distribution for \"' + courseName + "\"",
            data: Object.values(gradeDist),
            borderWidth: 2,
            backgroundColor: ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""],
        }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "#00FF59",
                    fontSize: 15
                }
            },
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
