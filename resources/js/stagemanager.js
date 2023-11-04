let editorCamera = null;
const canvasContainer = document.getElementById("canvas-container");
const canvasDocument = canvasContainer.contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

//MODE2D
const scrollZoomMultiplier = 1.15; //scrollZoomMarkiplier
const scrollZoomMax = 4000, scrollZoomMin = 100;

let selectedTool = "pointer";

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

const testVert = `
attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const testFrag = `
precision highp float;

uniform vec4 color;

varying vec2 vUv;

void main() {
    gl_FragColor = vec4(color.rgb, 0.5);
}
`

async function initializeRenderer() {
    editorCamera = new Camera();

    editorCamera.position.z = 10;

    game.activeCamera = editorCamera;

    game.editorDrawTool = () => window[selectedTool + "Draw"]();

    renderer.resizeHandler = () => {
        renderer.resizeSceneCamera(0,0,false);
    }
    renderer.resizeHandler();

    renderer.clearColor = new Color(0.2,0.2,0.2,1);

    game.editorloop();
}
