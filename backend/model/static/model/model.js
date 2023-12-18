// Object and Process forms
function getObjectTypeForm() {
    const typeFormDivElement = document.getElementById("typeForm");
    typeFormDivElement.innerHTML = "";

    // input
    const nameDivElement = document.createElement("div");
    nameDivElement.setAttribute("id", "typeName");

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Object Name");

    nameDivElement.appendChild(inputElement);

    // buttons
    const typeFormButtonsElement = document.getElementById("typeButtons");
    typeFormButtonsElement.innerHTML = "";

    const addObjectAttributeButton = document.createElement("button");
    addObjectAttributeButton.innerText = "Add Attribute";
    addObjectAttributeButton.addEventListener("click", addObjectAttribute);

    const saveObjectTypeButton = document.createElement("button");
    saveObjectTypeButton.innerText = "Save Object Type";
    saveObjectTypeButton.addEventListener("click", saveObjectType);

    typeFormButtonsElement.appendChild(addObjectAttributeButton);
    typeFormButtonsElement.appendChild(saveObjectTypeButton);

    typeFormDivElement.appendChild(nameDivElement);
}

function getObjectTypeSelect() {
    const options = ["String", "Number", "Datetime", "Boolean"];
    const selectElement = document.createElement("select");

    for (let i = 0; i < options.length; i++) {
        let optionElement = document.createElement("option");
        optionElement.setAttribute("value", options[i]);
        optionElement.setAttribute("label", options[i]);
        selectElement.appendChild(optionElement);
    }

    return selectElement;
}

function addObjectAttribute() {
    const element = document.getElementById("typeForm");

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    const selectElement = getObjectTypeSelect();

    const divElement = document.createElement("div");
    divElement.appendChild(inputElement);
    divElement.appendChild(selectElement);

    element.appendChild(divElement);
}

function saveObjectType() {
    const formDiv = document.getElementById("typeForm");
    const attributes = formDiv.children;
    const data = {};

    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].hasAttributes("id")) {
            // TODO validate against using the typeName in other fields and ID
            // TODO validate against empty name
            data["typeName"] = attributes[i].querySelector("input").value;
        } else {
            data[attributes[i].querySelector("input").value] =
                attributes[i].querySelector("select").value;
        }
    }

    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/object-types/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                // console.log(response)
                alert(`Object type save failed!\n${response}`);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });

    // console.log(data)
}

function getNewProcessForm() {
    const typeFormDivElement = document.getElementById("typeForm");
    typeFormDivElement.innerHTML = "";

    // name input
    const nameDivElement = document.createElement("div");
    nameDivElement.setAttribute("id", "processName");

    const processNameInput = document.createElement("input");
    processNameInput.setAttribute("type", "text");
    processNameInput.setAttribute("placeholder", "Process Name");

    nameDivElement.appendChild(processNameInput);

    // steps input
    const stepsDivElement = document.createElement("div");
    stepsDivElement.setAttribute("id", "processSteps");

    const processStepsInput = document.createElement("input");
    processStepsInput.setAttribute("type", "text");
    processStepsInput.setAttribute("placeholder", "Process Steps");

    stepsDivElement.appendChild(processStepsInput);

    // buttons
    const typeFormButtonsElement = document.getElementById("typeButtons");
    typeFormButtonsElement.innerHTML = "";

    const saveProcessStructureButton = document.createElement("button");
    saveProcessStructureButton.innerText = "Generate Process Structure";
    saveProcessStructureButton.addEventListener("click", saveProcessStructure);

    typeFormButtonsElement.appendChild(saveProcessStructureButton);
    typeFormDivElement.appendChild(nameDivElement);
    typeFormDivElement.appendChild(stepsDivElement);
}

function saveProcessStructure() {
    const formDiv = document.getElementById("typeForm");
    const attributes = formDiv.children;
    const data = {};

    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].hasAttributes("id")) {
            if (attributes[i].id === "processName") {
                data["processName"] =
                    attributes[i].querySelector("input").value;
            } else if (attributes[i].id === "processSteps") {
                data["processSteps"] =
                    attributes[i].querySelector("input").value;
            }
        }
    }

    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/process/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                // console.log(response)
                alert(`Object type save failed!\n${response}`);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

const addObjectTypeButton = document.getElementById("addObjectType");
addObjectTypeButton.addEventListener("click", getObjectTypeForm);

const addProcesButton = document.getElementById("addProcess");
addProcesButton.addEventListener("click", getNewProcessForm);

// Object List
document.addEventListener("DOMContentLoaded", getObjectsList);
function getObjectsList() {
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
                alert(`Object fetch failed!\n${response}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            const objectListElement = document.getElementById("objectsList");
            objectListElement.innerHTML = "objects list";
            const ulElement = document.createElement("ul");

            const dataKeys = data["object_types_id"];
            for (let i = 0; i < dataKeys.length; i++) {
                let listElement = document.createElement("li");
                listElement.textContent = dataKeys[i];
                ulElement.appendChild(listElement);
            }

            objectListElement.appendChild(ulElement);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

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
            processGraph();
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

// document.addEventListener("DOMContentLoaded", getProcessSteps)
function processGraph() {
    const canvasDiv = document.getElementById("modelContainer12");
    const canvasSvg = document.getElementById("modelCanvas");
    canvasSvg.innerHTML = "";

    const canvasDivHeight = canvasDiv.offsetHeight;
    const canvasDivWidth = canvasDiv.offsetWidth;

    const numSteps = Object.keys(processData).length;
    const numTransitions = numSteps - 1;
    const unitWidth = canvasDivWidth * (0.8 / (numSteps + numTransitions));

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
    const selectDivElement = document.createElement("div");
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
            updateStepButton.addEventListener("click", -)
            sidebarButtonsDiv.appendChild(updateStepButton)

            toggleSidebar()
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

// Sidebar
function toggleSidebar() {
    document.body.classList.toggle("showModelContainer1Sidebar")
}