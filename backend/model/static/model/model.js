// Object form
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
            data["name"] = attributes[i].querySelector("input").value;
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
                alert(`Object type save failed!\n${response}`);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

// Process form
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
                data["name"] =
                    attributes[i].querySelector("input").value;
            } else if (attributes[i].id === "processSteps") {
                data["steps"] =
                    attributes[i].querySelector("input").value;
            }
        }
    }

    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/process-types/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                alert(`Object type save failed!\n${response}`);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

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

            const ids = data["ids"];
            for (let i = 0; i < ids.length; i++) {
                let listElement = document.createElement("li");
                listElement.textContent = ids[i];
                ulElement.appendChild(listElement);
            }

            objectListElement.appendChild(ulElement);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

// Process list
document.addEventListener("DOMContentLoaded", getProcessesList);
function getProcessesList() {
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    fetch("/model/process-types/", {
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

            const ids = data["ids"];
            for (let i = 0; i < ids.length; i++) {
                const processSelectDivElement = document.createElement("div");
                processSelectDivElement.innerText = ids[i];
                objectListElement.appendChild(processSelectDivElement);
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

// Sidebar
function toggleSidebar() {
    document.body.classList.toggle("showModelContainer1Sidebar")
}

const addObjectTypeButton = document.getElementById("addObjectType");
addObjectTypeButton.addEventListener("click", getObjectTypeForm);

const addProcesButton = document.getElementById("addProcess");
addProcesButton.addEventListener("click", getNewProcessForm);