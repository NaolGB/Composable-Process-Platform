const addAttributeButton = document.getElementById("addObjectAttribute")
addAttributeButton.addEventListener("click", (e) => {
    const formId = addAttributeButton.dataset.typeFormId
    const element = document.getElementById(formId)

    const fieldId = Date.now() + performance.now()
    const inputLabel = document.createElement('input')
    inputLabel.setAttribute('type', 'text')
    inputLabel.setAttribute('id', fieldId)
    inputLabel.setAttribute('name', fieldId)

    const select = objectTypeSelect(fieldId, fieldId)
    
    let div = document.createElement('div')
    div.appendChild(inputLabel)
    div.appendChild(select)

    element.appendChild(div)

});

function objectTypeSelect(selectName, selectId) {
    const options = ['String', 'Number', 'Datetime', 'Boolean']
    const select = document.createElement('select')
    select.name = selectName
    select.id = selectId
    
    for (let i=0; i<options.length; i++) {
        let optionElement = document.createElement('option')
        optionElement.setAttribute('value', options[i])
        optionElement.setAttribute('label', options[i])

        select.appendChild(optionElement)
    }

    return select
}

const saveObjectTypeButton = document.getElementById('saveObjectType')
saveObjectTypeButton.addEventListener("click", (e) => {
    // TODO validate inputs
    const formId = saveObjectTypeButton.dataset.typeFormId
    const formDiv = document.getElementById(formId)
    const attributes = formDiv.children
    const data = {}

    for (let i=0; i<attributes.length; i++) {
        data[attributes[i].querySelector('input').value] = attributes[i].querySelector('select').value
    }

    console.log(data)
});