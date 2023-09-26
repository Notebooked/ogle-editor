const propertyList = document.getElementById("property-list");

async function propertiesUpdateSelectedNode() {
    const nodeClass = await getClassFromSource(selectedNodeJSON.className);

    nodeClass.editorProperties.forEach((editorProperty) => {
        createEditorPropertyContainer(editorProperty);
    })
}

function createEditorPropertyString(propertyName, propertyValue, propertyContainer) {
    const propertyNameSpan = document.createElement("span");
    propertyNameSpan.classList.add("property-name");
    propertyNameSpan.innerHTML = propertyName;
    propertyContainer.appendChild(propertyNameSpan);

    const propertyValueSpan = document.createElement("span");
    propertyValueSpan.classList.add("property-value");
    propertyValueSpan.innerHTML = propertyValue;
    propertyContainer.appendChild(propertyValueSpan);
}

function createEditorPropertyContainer(editorProperty) {
    const propertyContainer = document.createElement("div");
    propertyContainer.classList.add("property-container");

    if (editorProperty[2] === "string") {
        createEditorPropertyString(editorProperty[0], editorProperty[1], propertyContainer);
    }

    propertyList.appendChild(propertyContainer);
}