let sceneJSON = null;
let selectedNodePreinit = null;

let rootPreinit = null;

const preinitIDTable = {};
let currentPreinitID = 0;

async function openSceneFile(path) {
    const sceneFile = await Neutralino.filesystem.readFile(path);

    sceneJSON = JSON.parse(sceneFile);

    initializeNode(sceneJSON.root, null);

    reloadScene();
}

function initializeNode(nodeJSON, parentPreinit) {
    console.log(nodeJSON, parentPreinit)

    const nodePreinit = createPreinitObject(nodeJSON, parentPreinit);
    if (parentPreinit !== null) parentPreinit.children.push(nodePreinit);
    else rootPreinit = nodePreinit;
    preinitIDTable[currentPreinitID] = nodePreinit;
    currentPreinitID++;

    nodeJSON.children.forEach((childJSON) => initializeNode(childJSON, nodePreinit));
}

function createPreinitObject(nodeJSON, parentPreinit) {
    return {
        id: currentPreinitID,
        name: nodeJSON.name,
        parent: parentPreinit,
        children: [] //ADD PROPERTY OF CLASS
    }
}

function clearScene() {
    //make this
}

function reloadScene() {
    updateHierarchy();
}

function hierarchySelectedNode(nodePreinit) {
    selectedNodePreinit = nodePreinit;

    propertiesUpdateSelectedNode();
}

function hierarchyDeselected() {
    selectedNodePreinit = null;
}

function propertiesChangedName(nodePreinit) {
    hierarchyUpdateNodeName(nodePreinit);
}