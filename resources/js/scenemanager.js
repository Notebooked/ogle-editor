let sceneJSON = null;

let selectedNodeID = null; //id of currently selected node
let rootNode = null;

const nodeIDTable = {};
let currentNodeID = 0; //variable for initializing id

let mode = "2D";

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
    
    newNode.id = currentNodeID;
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
    updateHierarchy();
}

function hierarchySelectedNode(nodeID) {
    selectedNodeID = nodeID;

    propertiesUpdateSelectedNode();
}

function hierarchyDeselected() {
    selectedNodeID = null;
}

function propertiesChangedName(nodeID) {
    hierarchyUpdateNodeName(nodeID);
}

function setMode2D(modeElement) {
    mode = "2D";

    modeElement.classList.add("active-mode");
}