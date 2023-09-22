let sceneJSON = null;
let selectedNodeJSON = null;

async function openSceneFile(path) {
    const sceneFile = await Neutralino.filesystem.readFile(path);

    sceneJSON = JSON.parse(sceneFile);

    reloadScene();
}

function clearScene() {
    //make this
}

function reloadScene() {
    updateHierarchy();
}

function hierarchySelectedNode(nodeJSON) {
    selectedNodeJSON = nodeJSON;

    propertiesUpdateSelectedNode();
}

function hierarchyDeselected() {
    selectedNodeJSON = null;
}