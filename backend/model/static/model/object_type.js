
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
        if (attributes[i].hasAttributes("id")) {
            // TODO validate against using the typeName in other fields and ID
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
            'X-CSRFToken': csrfToken,
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

const addAttributeButton = document.getElementById("addObjectAttribute");
addAttributeButton.addEventListener("click", addAttribute);

const saveObjectTypeButton = document.getElementById("saveObjectType");
saveObjectTypeButton.addEventListener("click", saveObjectType);

const all_types = document.getElementById("objectTypesData")
let x = JSON.parse(all_types.getAttribute("data-object-types"))
console.log(x)
