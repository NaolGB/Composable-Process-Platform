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

// function getActivityTypeForm() {
//         const typeFormDivElement = document.getElementById("typeForm");
//     typeFormDivElement.innerHTML = "";

//     // input
//     const nameDivElement = document.createElement("div");
//     nameDivElement.setAttribute("id", "typeName");

//     const inputElement = document.createElement("input");
//     inputElement.setAttribute("type", "text");
//     inputElement.setAttribute("placeholder", "Activity Name");
//     typeFormDivElement.appendChild(nameDivElement);

//     // select
//     // embed it in a div for uniform method of collecting data for send
//     const selectDivElement = document.createElement("div");
//     const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
//     fetch("/model/object-types/", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": csrfToken,
//         },
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 alert(`Object type save failed!\n${response}`);
//             } else {
//                 return response.json();
//             }
//         })
//         .then((data) => {
//             const selectElement = document.createElement("select");
//             const object_types = Object.keys(data)

//             for (let i = 0; i <  object_types.length; i++) {
//                 const optionElement = document.createElement("option");
//                 optionElement.setAttribute("value", object_types[i]);
//                 optionElement.setAttribute("label", object_types[i]);
//                 selectElement.appendChild(optionElement);
//             }
//             selectDivElement.appendChild(selectElement);
//             typeFormDivElement.appendChild(selectDivElement);

//         })
//         .catch((error) => {
//             console.log(`Error: ${error}`);
//         });

//     nameDivElement.appendChild(inputElement);

//     // buttons
//     const typeFormButtonsElement = document.getElementById("typeButtons");
//     typeFormButtonsElement.innerHTML = "";

//     const saveActivityTypeButton = document.createElement("button");
//     saveActivityTypeButton.innerText = "Save Actibity Type";
//     saveActivityTypeButton.addEventListener("click", saveActivityType);

//     typeFormButtonsElement.appendChild(saveActivityTypeButton);

// }

// function saveActivityType() {
//     const formDiv = document.getElementById("typeForm");
//     const attributes = formDiv.children;
//     const data = {};

//     for (let i = 0; i < attributes.length; i++) {
//         if (attributes[i].hasAttributes("id")) {
//             // TODO validate against using the typeName in other fields and ID
//             // TODO validate against empty name
//             data["typeName"] = attributes[i].querySelector("input").value;
//         } else {
//             data['object'] = attributes[i].querySelector("select").value;
//         }
//     }

//     const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
//     fetch("/model/activity-types/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify(data),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 // console.log(response)
//                 alert(`Activity type save failed!\n${response}`);
//             }
//         })
//         .catch((error) => {
//             console.log(`Error: ${error}`);
//         });

// }

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
            console.log()
            if (attributes[i].id === "processName") {
                data["processName"] =
                    attributes[i].querySelector("input").value;
            } 
            else if (attributes[i].id === "processSteps") {
                data["processSteps"] = attributes[i].querySelector("input").value;
            }
        }
    }

    console.log(data);
    // const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)[1];
    // fetch("/model/object-types/", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "X-CSRFToken": csrfToken,
    //     },
    //     body: JSON.stringify(data),
    // })
    //     .then((response) => {
    //         if (!response.ok) {
    //             // console.log(response)
    //             alert(`Object type save failed!\n${response}`);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(`Error: ${error}`);
    //     });
}

const addObjectTypeButton = document.getElementById("addObjectType");
addObjectTypeButton.addEventListener("click", getObjectTypeForm);

// const addActivityTypeButton = document.getElementById("addActivityType");
// addActivityTypeButton.addEventListener("click", getActivityTypeForm);

const addProcesButton = document.getElementById("addProcess");
addProcesButton.addEventListener("click", getNewProcessForm);
