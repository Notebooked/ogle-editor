import { Layer, Camera, Camera2D, Color } from "../oglsrc/index.mjs";
import { initTools } from "./initTools.js";

const canvasContainer = document.getElementById("canvas-container");
const canvasDocument = canvasContainer.contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

export class StageManager {//TODO: why is this stuff in stagemanager
    constructor(editor) {
        this.editor = editor;

        this.editorCamera = new Camera();
        this.editorCamera2D = new Camera2D();
    
        this.editorCamera.position.z = 10;
        this.editorCamera.type = "orthographic";
        this.gameCanvas = gameCanvas;

        this.tools = initTools(this.editor);

        this.selectedTool = "pointer";
        this.selectedToolElement = document.getElementsByClassName("tool-img")[0];

        const toolEventList = ["mousedown", "mousemove", "mouseup", "wheel"];

        toolEventList.forEach((eventName) => {
            canvasDocument.addEventListener(eventName, (e) => {
                this.tools["pan"].toolEvent(e);
                this.tools[this.selectedTool].toolEvent(e);
            });
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
    }

    setTool(element, toolName) {
        this.selectedToolElement.classList.remove("tool-active");
    
        this.selectedToolElement = element;
        this.selectedTool = toolName;
    
        this.selectedToolElement.classList.add("tool-active");
    }

    initializeRenderer() {    
        this.editor.sceneManager.game.activeCamera = this.editorCamera;
        this.editor.sceneManager.game.activeCamera2D = this.editorCamera2D;
    
        this.editor.sceneManager.game.editorUpdate = () => {
            this.tools["pan"].toolUpdate(); //this isnt even needed
            this.tools[this.selectedTool].toolUpdate();
            this.tools[this.selectedTool].toolDraw();
            //TODO: funny the gui layers being rendered with editor camera
        };
    
        this.editor.sceneManager.game.renderer.resizeHandler = () => {
            this.editor.sceneManager.game.renderer.resizeSceneCamera(0,0,false);
    
            this.editorCamera2D.generateViewMatrix();
        }
        this.editor.sceneManager.game.renderer.resizeHandler();
        
        this.editor.sceneManager.game.renderer.clearColor = new Color(0.2,0.2,0.2,1);
    
        this.editor.sceneManager.game.editorloop();
    }
}
