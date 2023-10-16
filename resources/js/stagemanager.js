let editorCamera = null;
const canvasDocument = document.getElementById("canvas-container").contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

let k = 1000;

//MODE2D
let draggingCanvas = false;

let scrollZoomMultiplier = 1.25; //scrollZoomMarkiplier
//add scroll max and min

function normalizeCanvasCoordinates(x, y) {
    return [(x / gameCanvas.clientWidth - 0.5) * 2, ((1 - y / gameCanvas.clientHeight) - 0.5)*2];
}

canvasDocument.addEventListener('mousedown', (e) => {
    checkMousecastObject(e);

    if (selectedNodeID === null) draggingCanvas = true;
});

canvasDocument.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / gameCanvas.clientWidth - 0.5) * 2;
    mouseY = ((1 - e.clientY / gameCanvas.clientHeight) - 0.5) * 2;

    if (draggingCanvas) {
        dragCanvas(e);
    }
});

canvasDocument.addEventListener('mouseup', (e) => {
    draggingCanvas = false;
});

canvasDocument.addEventListener('wheel', (e) => {
    const [mouseX, mouseY] = normalizeCanvasCoordinates(e.clientX, e.clientY);

    const beforeRightBound = editorCamera.rightBound / editorCamera.zoom;
    const beforeTopBound = editorCamera.top / editorCamera.zoom;

    if (e.deltaY > 0) {
        editorCamera.zoom /= scrollZoomMultiplier;
    } else {
        editorCamera.zoom *= scrollZoomMultiplier;
    }

    const afterRightBound = editorCamera.rightBound / editorCamera.zoom;
    const afterTopBound = editorCamera.top / editorCamera.zoom;

    const difX = beforeRightBound - afterRightBound;
    const difY = beforeTopBound - afterTopBound;

    editorCamera.position.x += difX * mouseX;
    editorCamera.position.y += difY * mouseY;
});

function checkMousecastObject(e) {
    let raycast = new Raycast();

    raycast.castMouse(editorCamera, normalizeCanvasCoordinates(e.clientX, e.clientY));

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
