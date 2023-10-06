const stageContainer = document.getElementById("stage-container");

let editorCamera = null;

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
