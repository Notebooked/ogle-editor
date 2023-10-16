const propertyList = document.getElementById("property-list");

function propertiesUpdateSelectedNode() {
    propertyList.innerHTML = "";

    const node = getSelectedNode();

    let createdProperties = [];

    Node.editorProperties.forEach((editorProperty) => {
        createEditorPropertyContainer(editorProperty);

        createdProperties.push(editorProperty);
    })

    let currentClass = node.nodeClass;
    while (currentClass !== Node) {
        if (currentClass.editorProperties) {
            currentClass.editorProperties.forEach((editorProperty) => {
                if (!createdProperties.includes(editorProperty)) {
                    createEditorPropertyContainer(editorProperty);

                    createdProperties.push(editorProperty);
                }
            })
        }

        currentClass = Object.getPrototypeOf(currentClass);
    }
}

function propertiesUpdateDeselected() {
    propertyList.innerHTML = "";
}

function createEditorPropertyString(propertyName, propertyValue, canEdit, propertyContainer) {
    const propertyNameSpan = document.createElement("span");
    propertyNameSpan.classList.add("property-name");
    propertyNameSpan.innerHTML = propertyName;
    propertyContainer.appendChild(propertyNameSpan);

    const propertyValueElement = document.createElement("input");
    propertyValueElement.type = "text";
    propertyValueElement.name = "property-input";
    propertyValueElement.classList.add("property-value","property-value-string");
    propertyValueElement.value = propertyValue;
    if (!canEdit) propertyValueElement.disabled = true;

    if (canEdit) propertyValueElement.onchange = () => propertyValueElementChangedString(propertyName, propertyValueElement, selectedNodeID);
    propertyContainer.appendChild(propertyValueElement);
}

function propertyValueElementChangedString(propertyName, propertyValueElement, nodeID) {
    const newValue = propertyValueElement.value;

    if (propertyName === "name" && newValue.trim() === "") {
        propertyValueElement.focus();
    } else {
        propertyValueElement.blur(); //deselect entry

        const node = nodeIDTable[nodeID];

        node[propertyName] = propertyValueElement.value;

        if (propertyName === "name") propertiesChangedName(nodeID);
    }
}

function createEditorPropertyBoolean(propertyName, propertyValue, canEdit, propertyContainer) {
    const propertyNameSpan = document.createElement("span");
    propertyNameSpan.classList.add("property-name");
    propertyNameSpan.innerHTML = propertyName;
    propertyContainer.appendChild(propertyNameSpan);

    const propertyValueElement = document.createElement("input");
    propertyValueElement.type = "checkbox";
    propertyValueElement.name = "property-input";
    propertyValueElement.classList.add("property-value","property-value-boolean");
    propertyValueElement.checked = propertyValue;
    if (!canEdit) propertyValueElement.disabled = true;

    if (canEdit) propertyValueElement.onchange = () => propertyValueElementChangedBoolean(propertyName, propertyValueElement, selectedNodeID);
    propertyContainer.appendChild(propertyValueElement);
}

function propertyValueElementChangedBoolean(propertyName, propertyValueElement, nodeID) {
    const newValue = propertyValueElement.checked;

    propertyValueElement.blur(); //deselect entry

    const node = nodeIDTable[nodeID];

    node[propertyName] = newValue;
}

function createEditorPropertyVectorEntry(vectorComponent, propertyName, propertyValue, canEdit, propertyValueContainer) {
    const propertyValueElement = document.createElement("input");
    propertyValueElement.type = "number";
    propertyValueElement.name = "property-input";
    propertyValueElement.classList.add("property-value","property-value-number");
    propertyValueElement.value = "" + propertyValue[vectorComponent];

    if (!canEdit) propertyValueElement.disabled = true;
    if (canEdit) propertyValueElement.onchange = () => propertyValueElementChangedVector3(propertyName, propertyValueElement, selectedNodeID, vectorComponent);

    propertyValueContainer.appendChild(propertyValueElement);
}

function createEditorPropertyVector2(propertyName, propertyValue, canEdit, propertyContainer) {
    const propertyNameSpan = document.createElement("span");
    propertyNameSpan.classList.add("property-name");
    propertyNameSpan.innerHTML = propertyName;
    propertyContainer.appendChild(propertyNameSpan);

    const propertyValueContainer = document.createElement("div");
    propertyValueContainer.classList.add("property-value", "property-value-vector");

    createEditorPropertyVectorEntry("x", propertyName, propertyValue, canEdit, propertyValueContainer);
    createEditorPropertyVectorEntry("y", propertyName, propertyValue, canEdit, propertyValueContainer);

    propertyContainer.appendChild(propertyValueContainer);
}

function propertyValueElementChangedVector2(propertyName, propertyValueElement, nodeID, vectorComponent) {
    const newValue = parseFloat(propertyValueElement.value);

    propertyValueElement.blur(); //deselect entry

    const node = nodeIDTable[nodeID];

    node[propertyName][vectorComponent] = newValue;
}

function createEditorPropertyVector3(propertyName, propertyValue, canEdit, propertyContainer) {
    const propertyNameSpan = document.createElement("span");
    propertyNameSpan.classList.add("property-name");
    propertyNameSpan.innerHTML = propertyName;
    propertyContainer.appendChild(propertyNameSpan);

    const propertyValueContainer = document.createElement("div");
    propertyValueContainer.classList.add("property-value", "property-value-vector");

    createEditorPropertyVectorEntry("x", propertyName, propertyValue, canEdit, propertyValueContainer);
    createEditorPropertyVectorEntry("y", propertyName, propertyValue, canEdit, propertyValueContainer);
    createEditorPropertyVectorEntry("z", propertyName, propertyValue, canEdit, propertyValueContainer);

    propertyContainer.appendChild(propertyValueContainer);
}

function propertyValueElementChangedVector3(propertyName, propertyValueElement, nodeID, vectorComponent) {
    const newValue = parseFloat(propertyValueElement.value);

    propertyValueElement.blur(); //deselect entry

    const node = nodeIDTable[nodeID];

    node[propertyName][vectorComponent] = newValue;
}

function createEditorPropertyContainer(editorProperty) {
    const propertyContainer = document.createElement("div");
    propertyContainer.classList.add("property-container");

    if (editorProperty[2] === "string") {
        createEditorPropertyString(editorProperty[0], getSelectedNode()[editorProperty[0]], editorProperty[1], propertyContainer);
    } else if (editorProperty[2] === "boolean") {
        createEditorPropertyBoolean(editorProperty[0], getSelectedNode()[editorProperty[0]], editorProperty[1], propertyContainer);
    } else if (editorProperty[2] === "vector2") {
        createEditorPropertyVector2(editorProperty[0], getSelectedNode()[editorProperty[0]], editorProperty[1], propertyContainer);
    } else if (editorProperty[2] === "vector3") {
        createEditorPropertyVector3(editorProperty[0], getSelectedNode()[editorProperty[0]], editorProperty[1], propertyContainer);
    }

    propertyList.appendChild(propertyContainer);
}
