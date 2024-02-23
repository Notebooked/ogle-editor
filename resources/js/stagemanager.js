let editorCamera = null;
let editorCamera2D = null;
const canvasContainer = document.getElementById("canvas-container");
const canvasDocument = canvasContainer.contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

//TODO: implement this !!
let editorGuiLayer = null;

let selectedTool = "pointer";
let selectedToolElement = document.getElementsByClassName("tool-img")[0];

function setTool(element, toolName) {
    selectedToolElement.classList.remove("tool-active");

    selectedToolElement = element;
    selectedTool = toolName;

    selectedToolElement.classList.add("tool-active");
}

const toolEventList = ["mousedown", "mousemove", "mouseup", "wheel"];

toolEventList.forEach((toolEvent) => {
    canvasDocument.addEventListener(toolEvent, (e) => window[selectedTool + "Event"](e));
})

const canvas2dContextOptions = [
    ["Create Node Here", (e) => {console.log(e);}]
];

canvasDocument.addEventListener("click", (e) => hideContextMenu());
canvasDocument.addEventListener("mousedown", (e) => {
    if (e.button === 1) e.preventDefault();
});
canvasDocument.addEventListener("contextmenu", (e) => {
    const canvasContainerRect = canvasContainer.getBoundingClientRect();
    const position = [e.x + canvasContainerRect.left, e.y + canvasContainerRect.top];

    showContextMenu(e, canvas2dContextOptions, position);
});

async function initializeRenderer() {
    editorGuiLayer = new Layer()

    editorCamera = new Camera();
    editorCamera2D = new Camera2D();

    editorCamera.position.z = 10;
    editorCamera.type = "orthographic";

    editorGuiLayer = new Layer();
    editorGuiLayer.layerIdx = 1024;

    game.activeCamera = editorCamera;
    game.activeCamera2D = editorCamera2D;
    game.editorGuiLayer = editorGuiLayer;

    game.editorUpdateGui = () => window[selectedTool + "Update"]();

    renderer.resizeHandler = () => {
        renderer.resizeSceneCamera(0,0,false);

        editorCamera2D.generateViewMatrix();
    }
    renderer.resizeHandler();

    renderer.clearColor = new Color(0.2,0.2,0.2,1);

    game.editorloop();
}
