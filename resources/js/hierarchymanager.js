const hierarchyContainer = document.getElementById("hierarchy-list");

let selectedNodeLabelContainer = null;

function updateHierarchy() {
    addNodeToHierarchy(rootPreinit, hierarchyContainer);
}

function clearHierarchy() {
    hierarchyContainer.innerHTML = "";
}

function addNodeToHierarchy(nodePreinit, parentContainer) {
    const nodeName = nodePreinit.name;

    const nodeContainer = document.createElement("div");
    nodeContainer.classList.add("hierarchy-node-container");

    const nodeLabelContainer = document.createElement("div");
    nodeLabelContainer.classList.add("hierarchy-node-label-container");
    nodeLabelContainer.preinitID = nodePreinit.id;
    nodeContainer.appendChild(nodeLabelContainer);

    if (nodePreinit.children.length > 0) {
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
    nodePreinit.children.forEach((child) => {
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
        nodeLabelContainerMouseDown(e.target.parentElement, preinitIDTable[e.target.parentElement.preinitID]);
    }
    else if (e.target.classList.contains("hierarchy-node-label-container")) {
        nodeLabelContainerMouseDown(e.target, preinitIDTable[e.target.preinitID]);
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

function nodeLabelContainerMouseDown(nodeLabelContainer, nodePreinit) {
    deselectNodeContainer();

    hierarchySelectedNode(nodePreinit);

    selectedNodeLabelContainer = nodeLabelContainer;

    nodeLabelContainer.classList.add("hierarchy-node-label-container-selected");
}

function updateHierarchySelected() {
    //SELECTED FROM CANVAS
}

function hierarchyUpdateNodeName(nodePreinit) {

    const nodeContainer = JSONObjectToHierarchy[nodePreinit];

    console.log(nodeContainer,nodeContainer.querySelector('.hierarchy-node-label'));
}