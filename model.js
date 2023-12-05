function addInputField(formId) {
    const element = document.getElementById(formId)

    const fieldId = Date.now() + performance.now()
    const label = document.createElement('label')
    label.setAttribute('for', fieldId)

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('id', formId)
    input.setAttribute('name', formId)

    element.appendChild(label)
    element.appendChild(input)
}

console.log(Date.now() + performance.now()) 