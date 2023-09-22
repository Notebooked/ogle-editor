const hierarchyContainer = document.getElementById("hierarchy-list");

let selectedNodeLabelContainer = null;

function updateHierarchy() {
    addNodeToHierarchy(sceneJSON.root, hierarchyContainer);
}

function clearHierarchy() {
    hierarchyContainer.innerHTML = "";
}

function addNodeToHierarchy(nodeJSON, parentContainer) {
    const nodeName = nodeJSON.name;

    const nodeContainer = document.createElement("div");
    nodeContainer.classList.add("hierarchy-node-container");

    const nodeLabelContainer = document.createElement("div");
    nodeLabelContainer.classList.add("hierarchy-node-label-container");
    nodeLabelContainer.nodeJSON = nodeJSON;
    nodeContainer.appendChild(nodeLabelContainer);

    if (nodeJSON.children.length > 0) {
        const arrowDrop = document.createElement("img");
        arrowDrop.src = "editorimg/dropdown.png";
        arrowDrop.classList.add("hierarchy-arrow-drop");
        arrowDrop.nodeContainer = nodeContainer;
        nodeLabelContainer.appendChild(arrowDrop);
    }

    const nodeLabel = document.createElement("span");
    nodeLabel.innerHTML = nodeName;
    nodeLabel.classList.add("hierarchy-node-label");
    nodeLabelContainer.appendChild(nodeLabel);

    const childrenContainer = document.createElement("div");
    childrenContainer.classList.add("hierarchy-children-container");
    nodeContainer.appendChild(childrenContainer);
    nodeJSON.children.forEach((child) => {
        addNodeToHierarchy(child, childrenContainer);
    })

    parentContainer.appendChild(nodeContainer);
}

function deselectNodeContainer() {
    if (selectedNodeLabelContainer !== null) selectedNodeLabelContainer.classList.remove("hierarchy-node-label-container-selected");
    
    hierarchyDeselected();
}

document.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("hierarchy-node-label")) {
        nodeLabelContainerMouseDown(e.target.parentElement, e.target.parentElement.nodeJSON);
    }
    else if (e.target.classList.contains("hierarchy-node-label-container")) {
        nodeLabelContainerMouseDown(e.target, e.target.nodeJSON);
    }
    else if (e.target.classList.contains("hierarchy-arrow-drop")) {
        hierarchyArrowDropMouseDown(e.target.nodeContainer);
    }
    else if (e.target.id === "hierarchy-list") {
        deselectNodeContainer();
    }
})

function hierarchyArrowDropMouseDown(nodeContainer) {
    nodeContainer.classList.toggle("hierarchy-hide-children");
}

function nodeLabelContainerMouseDown(nodeLabelContainer, nodeJSON) {
    hierarchySelectedNode(nodeJSON);

    deselectNodeContainer();

    selectedNodeLabelContainer = nodeLabelContainer;

    nodeLabelContainer.classList.add("hierarchy-node-label-container-selected");
}

function updateHierarchySelected() {
    //SELECTED FROM CANVAS
}