let sceneJSON = null;

let selectedNodeID = null; //id of currently selected node
let rootNode = null;

const nodeIDTable = {};
let currentNodeID = 0; //variable for initializing id

let mode = "2D";
let modeElements = document.getElementsByClassName("mode");

let game = null;
let renderer = null;

async function initialize() {
    await loadAllClasses();

    game = new EditorGame();
    renderer = game.renderer;

    initializeRenderer();
}
initialize();

function getSelectedNode() {
    if (selectedNodeID === null) return null;
    return nodeIDTable[selectedNodeID];
}

async function openSceneFile(path) {
    const sceneFile = await Neutralino.filesystem.readFile(path);

    sceneJSON = JSON.parse(sceneFile);

    await initializeNode(sceneJSON.root, null);

    reloadScene();
}

async function initializeNode(nodeJSON, parentNode) {
    const newNode = await initializeNodeJSON(nodeJSON, parentNode);
    if (parentNode === null) {
        rootNode = newNode;
        game.setScene(rootNode);
    }
    nodeIDTable[currentNodeID] = newNode;
    currentNodeID++;

    for (var i = 0; i < nodeJSON.children.length; i++) {
        const childJSON = nodeJSON.children[i];

        await initializeNode(childJSON, newNode);
    }
}

async function initializeNodeJSON(nodeJSON, parentNode) {
    const nodeClass = await getClassFromSource(nodeJSON.className);

    const newNode = new nodeClass();
    
    newNode.nodeID = currentNodeID;
    newNode.nodeClass = nodeClass;
    newNode.name = nodeJSON.name;
    newNode.parent = parentNode;
    
    Object.keys(nodeJSON.initProperties).forEach((initProperty) => {
        newNode[initProperty] = eval(nodeClass.initProperties[initProperty]);
    })
    nodeJSON.initFunctionCalls.forEach((initFunctionCall) => {
        eval("newNode." + initFunctionCall);
    })

    return newNode;
}

function clearScene() {
    //make this
}

function reloadScene() {
    initializeHierarchy();
}

function hierarchySelectedNode(nodeID) {
    selectedNodeID = nodeID;

    propertiesUpdateSelectedNode();
}

function hierarchyDeselected() {
    selectedNodeID = null;
    propertiesUpdateDeselected();
}

function canvasSelectedNode(nodeID) {
    selectedNodeID = nodeID;

    hierarchyUpdateSelectedNode();
    propertiesUpdateSelectedNode();
}

function canvasDeselected() {
    selectedNodeID = null;

    hierarchyUpdateDeselected();
    propertiesUpdateDeselected();
}

function propertiesChangedName(nodeID) {
    hierarchyUpdateNodeName(nodeID);
}

function setMode(modeIndex, modeName) {
    mode = modeName;

    modeElements[1 - modeIndex].classList.remove("active-mode");
    modeElements[modeIndex].classList.add("active-mode");
}