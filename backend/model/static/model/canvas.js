
// Process Graph
let processData = {}
document.addEventListener("DOMContentLoaded", getProcessesList);
function getProcessesList() {
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/process/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
    })
        .then((response) => {
            if (!response.ok) {
                alert(`Process fetch failed!\n${response}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            const objectListElement = document.getElementById("processesList");
            objectListElement.innerHTML = "processes list";

            const dataKeys = data["pu_ids"];
            for (let i = 0; i < dataKeys.length; i++) {
                const processSelectDivElement = document.createElement("div");
                processSelectDivElement.innerText = dataKeys[i];
                processSelectDivElement.addEventListener("click", function () {
                    selectProcess(dataKeys[i]);
                });
                objectListElement.appendChild(processSelectDivElement);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

function selectProcess(processId) {
    // get process steps
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch(`/model/process-graph/${processId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
    })
        .then((response) => {
            if (!response.ok) {
                alert(`Process fetch failed!\n${response}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            processData = data
            processGraph(processId);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

function saveProcess(processId) {
    console.log(processId)
}

function validateAndPublishProcess(processId) {
    console.log(processId)
}

// document.addEventListener("DOMContentLoaded", getProcessSteps)
function processGraph(processId) {
    const canvasDiv = document.getElementById("modelContainer12");
    const canvasSvg = document.getElementById("modelCanvas");
    canvasSvg.innerHTML = "";

    const canvasDivHeight = canvasDiv.offsetHeight;
    const canvasDivWidth = canvasDiv.offsetWidth;

    const numSteps = Object.keys(processData).length;
    const numTransitions = numSteps - 1;
    const unitWidth = canvasDivWidth * (0.8 / (numSteps + numTransitions));

    // add buttons
    const buttonsDiv = document.createElement('div')

    const savePUButton = document.createElement("div")
    savePUButton.innerText = "save Process"
    savePUButton.addEventListener("click", () => {saveProcess(processId)})
    buttonsDiv.appendChild(savePUButton)

    const publishProcessButton = document.createElement("div")
    publishProcessButton.innerText = "validate and publish Process"
    publishProcessButton.addEventListener("click", () => {validateAndPublishProcess(processId)})
    buttonsDiv.appendChild(publishProcessButton)

    canvasDiv.insertBefore(buttonsDiv, canvasDiv.firstChild)

    // add rect
    let startingX = canvasDivWidth * 0.1;
    const boxCenter = canvasDivHeight / 2 - unitWidth / 2;
    const lineCenter = boxCenter + unitWidth / 2;
    const steps = Object.keys(processData)
    for (let i=0; i<numSteps -1 ; i++) {
        // drawing the last rectangle outside the loop to avoid an extra transition line drawing
        const rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        rect.setAttribute("x", startingX);
        rect.setAttribute("y", boxCenter);
        rect.setAttribute("rx", "0.4%");
        rect.setAttribute("ry", "0.4%");
        rect.setAttribute("width", unitWidth);
        rect.setAttribute("height", unitWidth);
        rect.setAttribute("stroke", "black");
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("stroke-width", "2");
        rect.addEventListener("click", () => {fillSidebarWithPU(steps[i])})
        startingX += unitWidth;
        canvasSvg.appendChild(rect);

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );
        line.setAttribute("x1", startingX);
        line.setAttribute("y1", lineCenter);
        line.setAttribute("x2", startingX + 0.75 * unitWidth);
        line.setAttribute("y2", lineCenter);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        startingX += 0.75 * unitWidth;
        canvasSvg.appendChild(line);
    }

    // add the last rectangle
    const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );
    rect.setAttribute("x", startingX);
    rect.setAttribute("y", boxCenter);
    rect.setAttribute("rx", "0.4%");
    rect.setAttribute("ry", "0.4%");
    rect.setAttribute("width", unitWidth);
    rect.setAttribute("height", unitWidth);
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", "transparent");
    rect.setAttribute("stroke-width", "2");
    rect.addEventListener("click", () => {fillSidebarWithPU(steps[steps.length-1])})
    startingX += unitWidth;
    canvasSvg.appendChild(rect);

}

function fillSidebarWithPU(processStep) {
    // get Object Types to attach to a step
    // embed it in a div for uniform method of collecting data for send
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/object-types/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
    })
        .then((response) => {
            if (!response.ok) {
                alert(`Object type save failed!\n${response}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            // title
            const sidebarTitle = document.getElementById("sidebarTitle")
            sidebarTitle.innerHTML = ""
            const sidebarTitleText = document.createElement("h1")
            sidebarTitleText.textContent = processStep
            sidebarTitle.appendChild(sidebarTitleText)

            // main content
            const sidebarMainContent = document.getElementById("modelContainer1SidebarMainContent")
            sidebarMainContent.innerHTML = ""

            const currentObjectText = document.createElement("p")
            currentObjectText.textContent = `Current Object: ${processData[processStep]}`
            sidebarMainContent.appendChild(currentObjectText)
            
            const selectElement = document.createElement("select");
            const objectTypes = data['object_types_id']

            for (let i = 0; i <  objectTypes.length; i++) {
                const optionElement = document.createElement("option");
                optionElement.setAttribute("value", objectTypes[i]);
                optionElement.setAttribute("label", objectTypes[i]);
                selectElement.appendChild(optionElement);
            }
            sidebarMainContent.appendChild(selectElement);

            // buttons
            const sidebarButtonsDiv = document.getElementById("sidebarButtons")
            sidebarButtonsDiv.innerHTML = ""

            const closeSidebarButton = document.createElement("div")
            closeSidebarButton.setAttribute('id', 'closeSidebarButton')
            closeSidebarButton.innerText = "close sidebar"
            closeSidebarButton.addEventListener("click", toggleSidebar)
            sidebarButtonsDiv.appendChild(closeSidebarButton)

            const updateStepButton = document.createElement("div")
            updateStepButton.setAttribute('id', 'updateStepButton')
            updateStepButton.innerText = "save step"
            updateStepButton.addEventListener("click", () => {
                updatePUStep(processStep, selectElement.value)
            })
            sidebarButtonsDiv.appendChild(updateStepButton)

            toggleSidebar()
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

function updatePUStep(puStep, objectType) {
    processData[puStep] = objectType
    toggleSidebar()
}