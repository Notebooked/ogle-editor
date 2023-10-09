let editorCamera = null;
const canvasDocument = document.getElementById("canvas-container").contentWindow.document;

canvasDocument.addEventListener('mousedown', (e) => {
    let raycast = new Raycast();

    raycast.castMouse(editorCamera, [e.clientX, e.clientY]);

    let meshes = [];
    function rec(o) {
        if (o instanceof Mesh) meshes.push(o);
        o.children.forEach(rec);
    }
    rec(rootNode);

    console.log(raycast);

    console.log(raycast.intersectMeshes(meshes));
});

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
