const propertyList = document.getElementById("property-list");

async function propertiesUpdateSelectedNode() {
    propertyList.innerHTML = "";

    const nodeClass = getSelectedNodePreinit().class;

    nodeClass.editorProperties.forEach((editorProperty) => {
        createEditorPropertyContainer(editorProperty);
    })
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

    if (canEdit) propertyValueElement.onchange = () => propertyValueElementChangedString(propertyName, propertyValueElement, selectedNodePreinitID);
    propertyContainer.appendChild(propertyValueElement);
}

function createEditorPropertyContainer(editorProperty) {
    const propertyContainer = document.createElement("div");
    propertyContainer.classList.add("property-container");

    if (editorProperty[2] === "string") {
        createEditorPropertyString(editorProperty[0], getSelectedNodePreinit()[editorProperty[0]], editorProperty[1], propertyContainer);
    }

    propertyList.appendChild(propertyContainer);
}

function propertyValueElementChangedString(propertyName, propertyValueElement, nodePreinitID) {
    const newValue = propertyValueElement.value;

    if (propertyName === "name" && newValue.trim() === "") {
        propertyValueElement.focus();
    } else {
        propertyValueElement.blur(); //deselect entry

        const nodePreinit = preinitIDTable[nodePreinitID];

        nodePreinit[propertyName] = propertyValueElement.value;

        if (propertyName === "name") propertiesChangedName(nodePreinitID);
    }
}