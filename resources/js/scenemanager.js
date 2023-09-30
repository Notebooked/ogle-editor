let sceneJSON = null;

let selectedNodePreinitID = null; //id of currently selected preinit
let rootPreinit = null;

const preinitIDTable = {};
let currentPreinitID = 0; //variable for initializing id

function getSelectedNodePreinit() {
    if (selectedNodePreinitID === null) return null;
    return preinitIDTable[selectedNodePreinitID];
}

async function openSceneFile(path) {
    const sceneFile = await Neutralino.filesystem.readFile(path);

    sceneJSON = JSON.parse(sceneFile);

    await initializeNode(sceneJSON.root, null);

    reloadScene();
}

async function initializeNode(nodeJSON, parentPreinit) {
    const nodePreinit = await createPreinitObject(nodeJSON, parentPreinit);
    if (parentPreinit !== null) parentPreinit.children.push(nodePreinit);
    else rootPreinit = nodePreinit;
    preinitIDTable[currentPreinitID] = nodePreinit;
    currentPreinitID++;

    for (var i = 0; i < nodeJSON.children.length; i++) {
        const childJSON = nodeJSON.children[i];

        await initializeNode(childJSON, nodePreinit)
    }
}

async function createPreinitObject(nodeJSON, parentPreinit) {
    const preinitClass = await getClassFromSource(nodeJSON.className)

    return {
        id: currentPreinitID,
        name: nodeJSON.name,
        class: preinitClass,
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

function hierarchySelectedNode(nodePreinitID) {
    selectedNodePreinitID = nodePreinitID;

    propertiesUpdateSelectedNode();
}

function hierarchyDeselected() {
    selectedNodePreinitID = null;
}

function propertiesChangedName(nodePreinitID) {
    hierarchyUpdateNodeName(nodePreinitID);
}