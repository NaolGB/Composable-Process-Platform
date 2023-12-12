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

function addAttribute() {
    const element = document.getElementById("objectTypeForm");
    
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    const selectElement = getObjectTypeSelect();

    const divElement = document.createElement("div");
    divElement.appendChild(inputElement);
    divElement.appendChild(selectElement);

    element.appendChild(divElement);
}

function saveObjectType() {
    const formDiv = document.getElementById("objectTypeForm");
    const attributes = formDiv.children;
    const data = {};

    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].hasAttributes('id')) {
            data['name'] = attributes[i].querySelector('input').value
        }
        else{
            data[attributes[i].querySelector("input").value] =
            attributes[i].querySelector("select").value;
        }
    }
}

const addAttributeButton = document.getElementById("addObjectAttribute");
addAttributeButton.addEventListener("click", addAttribute)

const saveObjectTypeButton = document.getElementById("saveObjectType");
saveObjectTypeButton.addEventListener("click", saveObjectType)