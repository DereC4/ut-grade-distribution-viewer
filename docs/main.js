const submitButton = document.getElementById('subBut');
submitButton.addEventListener("click", parseName);
const chartDiv = document.querySelector('#grades');
const aboutDiv = document.querySelector('.about-text');
const formDiv = document.querySelector('.bg-form');
if (chartDiv.getAttribute('value') == 'invisible') {
    chartDiv.style.display = 'none';
}
var gradeChart;
const ctx = document.getElementById("gradeBar");
const gradeLabels = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
const backgroundColor = ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""];
/*
 Parse the input form and class data
*/
async function parseName() {
    let fiveDigit = document.getElementById('sectionNum').value;
    let className = document.getElementById('courseName').value.toUpperCase();
    let classNum = document.getElementById('courseNum').value;
    let department = document.getElementById('courseField').value.trim().toUpperCase();
    let semester = document.getElementById('semester').value;
    let departments = '';
    if (!fiveDigit) {
        await fetch('https://derec4.github.io/ut-grade-data/2022prefixes.json')
            .then(res => res.json())
            .then(data => {
                departments = data;
            });
        if (!className && !classNum && !department) {
            alert("At least fill out the form...");
            return;
        }
        if (!department || !classNum) {
            alert("Missing fields")
            return;
        }
        if (!departments.includes(department)) {
            alert("Invalid Department");
            return;
        }
        console.log(department, classNum.toString(), className.trim(), semester);
    }
    await PapaParse(department, classNum.toString(), className.trim(), semester, fiveDigit);
}

/*
 Fetch the necessary database depending on semester and filter based on the input data
*/
async function PapaParse(department, num, name, sem, unique) {
    let cData = '';
    let url = '';
    switch (sem) {
        case 'f2022':
            url = 'https://derec4.github.io/ut-grade-data/2022%20Fall.json';
            break;
        case 's2022':
            url = 'https://derec4.github.io/ut-grade-data/2022%20Summer.json';
            break;
        case 'sp2022':
            url = 'https://derec4.github.io/ut-grade-data/2022%20Spring.json';
            break;
        case 'f2021':
            url = 'https://derec4.github.io/ut-grade-data/2021%20Fall.json';
            break;
        case 's2021':
            url = 'https://derec4.github.io/ut-grade-data/2021%20Summer.json';
            break;
        case 'sp2021':
            url = 'https://derec4.github.io/ut-grade-data/2021%20Spring.json';
            break;
        case 'f2020':
            url = 'https://derec4.github.io/ut-grade-data/2020%20Fall.json';
            break;
        case 's2020':
            url = 'https://derec4.github.io/ut-grade-data/2020%20Summer.json';
            break;
        case 'sp2020':
            url = 'https://derec4.github.io/ut-grade-data/2020%20Spring.json';
            break;
        default:
            url = 'https://derec4.github.io/ut-grade-data/2022%20Fall.json';
            break;
    }
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            cData = data;
        });
    let selectedClass = '';
    if (unique) {
        selectedClass = cData.filter(cData => cData['Section Number'] == unique);
    } else {
        if (sem.substring(0, 2) === 's2') {
            console.log("Summer Semester Detected");
            selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                .filter(cData => cData["Course Number"].includes(num.toString().toUpperCase()))
                .filter(cData => cData["Course Title"].includes(name));
            if (selectedClass.length == 0) {
                // summer names are weird
                console.log("Invalid name; trying again with just the course number");
                selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                    .filter(cData => cData["Course Number"].includes(num.toString().toUpperCase()))
            }
        } else {
            selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                .filter(cData => cData["Course Number"] == num.toString().toUpperCase())
                .filter(cData => cData["Course Title"].includes(name));
            if (selectedClass.length == 0) {
                // Possible that the class name was typed wrong; try again with just the course number
                console.log("Invalid name; trying again with just the course number");
                selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                    .filter(cData => cData["Course Number"] == num.toString().toUpperCase());
            }
        }
    }
    if (selectedClass.length == 0) {
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

    let lableName = selectedClass[0]["Course Title"];
    let sameName = true;
    for (i in selectedClass) {
        let letterGrade = selectedClass[i]["Letter Grade"];
        let cnt = selectedClass[i]["Count of letter grade"]
        gradeDist[letterGrade] += cnt;
        if (sameName && !(lableName === selectedClass[i]["Course Title"])) {
            lableName = (sem.substring(0, 2) === 's2' ? "Remember, summer courses have special prefixes!" : "Multiple courses detected; try specifying a course name!");
            sameName = false;
        }
        // console.log(selectedClass[i]["Letter Grade"]);
        // console.log(selectedClass[i]["Count of letter grade"]);
    }
    console.log(gradeDist);
    if (gradeChart) {
        gradeChart.config.data = {
            labels: gradeLabels,
            datasets: [{
                label: '\"' + lableName + "\"",
                data: Object.values(gradeDist),
                borderWidth: 2,
                // borderColor: '#36A2EB',
                backgroundColor: backgroundColor,
            }]
        };
        gradeChart.update();
    } else {
        loadChart(gradeDist, lableName);
        aboutDiv.style.visibility = 'hidden';
        aboutDiv.style.display = 'none';
        chartDiv.style.display = '';
        formDiv.setAttribute("style", "grid-row: 1");
    }
}

function loadChart(gradeDist, courseName) {
    gradeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: gradeLabels,
            datasets: [{
                label: '\"' + courseName + "\"",
                data: Object.values(gradeDist),
                borderWidth: 2,
                backgroundColor: backgroundColor,
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