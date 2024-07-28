const aboutDiv = document.querySelector('.about-text');
const backgroundColor = ["rgb(98, 244, 54)", "rgb(129, 231, 10)", "rgb(151, 218, 0)", "rgb(168, 204, 0)", "rgb(181, 190, 0)", "rgb(191, 176, 0)", "rgb(199, 162, 0)", "rgb(205, 148, 0)", "rgb(209, 133, 0)", "rgb(211, 119, 0)", "rgb(210, 105, 0)", "rgb(208, 91, 23)", "rgb(204, 78, 36)", "rgb(198, 66, 46)", "rgb(190, 54, 54)", ""];
const chartDiv = document.querySelector('#grades');
const ctx = document.getElementById("gradeBar");
const formDiv = document.querySelector('.bg-form');
const gradeLabels = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
const submitButton = document.getElementById('subBut');
var gradeChart;

submitButton.addEventListener("click", parseName);
if (chartDiv.getAttribute('value') == 'invisible') {
    chartDiv.style.display = 'none';
}
Chart.defaults.global.defaultFontColor = "#F8F0E5";

/**
 * Parse the input forms and determines if any fields are missing
 */
async function parseName() {
    let className = document.getElementById('courseName').value.toUpperCase();
    let classNum = document.getElementById('courseNum').value;
    let department = document.getElementById('courseField').value.trim().toUpperCase();
    let departmentList = '';
    let semester = document.getElementById('semester').value;
    let instructor = document.getElementById('courseInstructor').value;

    await fetch('https://derec4.github.io/ut-grade-data/2022prefixes.json')
        .then(res => res.json())
        .then(data => {
            departmentList = data;
        });

    if (!className && !classNum && !department) {
        alert("At least fill out the form...");
        return;
    }

    if (!department || !classNum) {
        alert("Missing fields")
        return;
    }

    if (!departmentList.includes(department)) {
        alert("Invalid Department");
        return;
    }

    console.log(department, classNum.toString(), className.trim(), instructor.trim(), semester);
    await PapaParse(department, classNum.toString(), className.trim(), instructor.trim(), semester);
}

/**
 * Fetch the necessary table depending on the user selected semester. 
 * Then, filter through the table based on the input data to get grade info for the class.
 * Displays an alert if nothing could be found.
 */
async function PapaParse(department, num, name, instructor, sem) {
    const semesterURLs = {
        'sp2024': 'https://derec4.github.io/ut-grade-data/2024%20Spring.json',
        'f2023': 'https://derec4.github.io/ut-grade-data/2023%20Fall.json',
        's2023': 'https://derec4.github.io/ut-grade-data/2023%20Summer.json',
        'sp2023': 'https://derec4.github.io/ut-grade-data/2023%20Spring.json',
        'f2022': 'https://derec4.github.io/ut-grade-data/2022%20Fall.json',
        's2022': 'https://derec4.github.io/ut-grade-data/2022%20Summer.json',
        'sp2022': 'https://derec4.github.io/ut-grade-data/2022%20Spring.json',
        'f2021': 'https://derec4.github.io/ut-grade-data/2021%20Fall.json',
        's2021': 'https://derec4.github.io/ut-grade-data/2021%20Summer.json',
        'sp2021': 'https://derec4.github.io/ut-grade-data/2021%20Spring.json',
        'f2020': 'https://derec4.github.io/ut-grade-data/2020%20Fall.json',
        's2020': 'https://derec4.github.io/ut-grade-data/2020%20Summer.json',
        'sp2020': 'https://derec4.github.io/ut-grade-data/2020%20Spring.json',
    };    

    //Update to an array of URL options instead of a lengthy switch statement for readability
    const url = semesterURLs[sem] || 'https://derec4.github.io/ut-grade-data/2022%20Fall.json';
    const response = await fetch(url);
    const cData = await response.json();
    let selectedClass = cData.filter(cData => cData["Course Prefix"] == department);

    const altUrl = new URL('https://ut-grade-data.vercel.app/v2/query');
    const params = {
        department: department,
        sem: sem,
        num: num,
        professor: instructor
    };

    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.append(key, params[key]);
        }
    });

    // temp code below
    const url2 = 'https://ut-grade-data.vercel.app/v2/query?department=Computer Science&sem=Fall 2023&num=439&professor=Norman';

    try {
        const response = await fetch(altUrl);
        const data = await response.json();
        
        if (data.length === 0) {
            alert("No data found. Try again :(");
            return;
        } 

        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
    }

    if (sem.substring(0, 2) === 's2') {
        /**
         * Summer names are really weird but we can safely assume the prefix of the semester
         * will not become "s3" within the next lifetime
         */
        console.log("Summer Semester Detected");
        selectedClass = selectedClass.filter(cData => cData["Course Number"].includes(num.toString().toUpperCase())).filter(cData => cData["Course Title"].includes(name));
        if (selectedClass.length == 0) {
            selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                                 .filter(cData => cData["Course Number"].includes(num.toString().toUpperCase()))
        }
    } else {
        selectedClass = selectedClass.filter(cData => cData["Course Number"] == num.toString().toUpperCase()).filter(cData => cData["Course Title"].includes(name));
        if (selectedClass.length == 0) {
            // Possible that the class name was typed wrong; try again with just the course number
            console.log("Trying again with just the course number");
            selectedClass = cData.filter(cData => cData["Course Prefix"] == department)
                                 .filter(cData => cData["Course Number"] == num.toString().toUpperCase());
        }
    }
    if (selectedClass.length == 0) {
        // Still can't find anything? Exit without a chart and alert
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
        let cnt = selectedClass[i]["Count of letter grade"];
        gradeDist[letterGrade] += cnt;
        if (sameName && lableName !== selectedClass[i]["Course Title"]) {
            // We can reasonably expect that time stays in the 2000s for a few more years
            lableName = (sem.substring(0, 2) === 's2' ? "Remember, summer courses have special prefixes!" : "Multiple courses detected; try specifying a course name!");
            sameName = false;
        }

        // console.log(selectedClass[i]["Letter Grade"]);
        // console.log(selectedClass[i]["Count of letter grade"]);
    }
    console.log(gradeDist);
    (gradeChart ? updateChart(lableName, gradeDist) : createChart(gradeDist, lableName));
}

/**
 * If the chart is in a state of existence, we update the data values
 */
function updateChart(labelName, gradeDist) {
    gradeChart.config.data = {
        labels: gradeLabels,
        datasets: [{
            label: '\"' + labelName + "\"",
            data: Object.values(gradeDist),
            borderWidth: 2,
            backgroundColor: backgroundColor,
        }]
    };
    gradeChart.update();
}

/**
 * If the chart is nowhere to be found, we load a new chart, its attributes and the values
 * Then, make the chart visible on screen
 */
function createChart(gradeDist, courseName) {
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
    aboutDiv.style.visibility = 'hidden';
    aboutDiv.style.display = 'none';
    chartDiv.style.display = '';
    formDiv.setAttribute("style", "grid-row: 1");
}