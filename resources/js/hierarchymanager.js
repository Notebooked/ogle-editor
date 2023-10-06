const hierarchyContainer = document.getElementById("hierarchy-list");

let selectedNodeLabelContainer = null;

const idHierarchyContainerTable = {};

function updateHierarchy() {
    addNodeToHierarchy(rootNode, hierarchyContainer);
}

function clearHierarchy() {
    hierarchyContainer.innerHTML = "";
}

function addNodeToHierarchy(newNode, parentContainer) {
    const nodeName = newNode.name;

    const nodeContainer = document.createElement("div");
    nodeContainer.classList.add("hierarchy-node-container");

    const nodeLabelContainer = document.createElement("div");
    nodeLabelContainer.classList.add("hierarchy-node-label-container");
    nodeLabelContainer.nodeID = newNode.id;
    nodeContainer.appendChild(nodeLabelContainer);

    if (newNode.children.length > 0) {
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
    newNode.children.forEach((child) => {
        addNodeToHierarchy(child, childrenContainer);
    })

    idHierarchyContainerTable[newNode.id] = nodeContainer;

    parentContainer.appendChild(nodeContainer);
}

function deselectNodeContainer() {
    if (selectedNodeLabelContainer !== null) selectedNodeLabelContainer.classList.remove("hierarchy-node-label-container-selected");
    
    hierarchyDeselected();
}

document.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("hierarchy-node-label")) {
        nodeLabelContainerMouseDown(e.target.parentElement, e.target.parentElement.nodeID);
    }
    else if (e.target.classList.contains("hierarchy-node-label-container")) {
        nodeLabelContainerMouseDown(e.target, e.target.nodeID);
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

function nodeLabelContainerMouseDown(nodeLabelContainer, nodeID) {
    deselectNodeContainer();

    hierarchySelectedNode(nodeID);

    selectedNodeLabelContainer = nodeLabelContainer;

    nodeLabelContainer.classList.add("hierarchy-node-label-container-selected");
}

function updateHierarchySelected() {
    //SELECTED FROM CANVAS
}

function hierarchyUpdateNodeName(nodeID) {
    const node = nodeIDTable[nodeID];

    const nodeContainer = idHierarchyContainerTable[nodeID];

    const hierarchyLabel = nodeContainer.querySelector('.hierarchy-node-label');

    hierarchyLabel.innerHTML = node.name;
}