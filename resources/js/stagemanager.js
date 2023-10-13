let editorCamera = null;
const canvasDocument = document.getElementById("canvas-container").contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

//MODE2D
let draggingCanvas = false;

let scrollZoomIncrement = 25;

canvasDocument.addEventListener('mousedown', (e) => {
    checkMousecastObject(e);

    if (selectedNodeID === null) draggingCanvas = true;
});

canvasDocument.addEventListener('mousemove', (e) => {
    if (draggingCanvas) {
        dragCanvas(e);
    }
});

canvasDocument.addEventListener('mouseup', (e) => {
    draggingCanvas = false;
});

canvasDocument.addEventListener('wheel', (e) => {
    editorCamera.zoom += -(e.deltaY / Math.abs(e.deltaY)) * scrollZoomIncrement;
});

function checkMousecastObject(e) {
    let raycast = new Raycast();

    raycast.castMouse(editorCamera, [(e.clientX / gameCanvas.clientWidth - 0.5) * 2, ((1 - e.clientY / gameCanvas.clientHeight) - 0.5)*2]);

    let meshes = [];
    function rec(o) {
        if (o instanceof Mesh) meshes.push(o);
        o.children.forEach(rec);
    }
    rec(rootNode);

    let hits = raycast.intersectMeshes(meshes);

    if (hits.length === 0) canvasDeselected();
    else {
        canvasSelectedNode(hits[0].nodeID);
    }
}

function dragCanvas(e) {
    editorCamera.position.x -= e.movementX / (editorCamera.zoom / 4);
    editorCamera.position.y += e.movementY / (editorCamera.zoom / 4);
}

async function initializeRenderer() {
    editorCamera = new Camera();

    editorCamera.position.z = 10;

    game.activeCamera = editorCamera;

    renderer.resizeHandler = () => {
        renderer.resizeSceneCamera(0,0,false);
    }
    renderer.resizeHandler();

    game.editorloop();
}
