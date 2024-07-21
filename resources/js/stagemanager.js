import { Layer, Camera, Camera2D, Color } from "../oglsrc/index.mjs";
import { InputManager } from "../oglsrc/core/InputManager.js";
import { initTools } from "./initTools.js";

const canvasContainer = document.getElementById("canvas-container");
const canvasDocument = canvasContainer.contentWindow.document;
const gameCanvas = canvasDocument.getElementById("game-canvas");

export class StageManager {//TODO: why is this stuff in stagemanager
    constructor(editor) {
        this.editor = editor;

        this.editorCamera = new Camera();
        this.editorCamera2D = new Camera2D();

        this.inputManager = new InputManager(canvasDocument);
    
        this.editorCamera.position.z = 10;
        this.editorCamera.type = "orthographic";
        this.gameCanvas = gameCanvas;

        this.tools = initTools(this.editor);

        this.selectedTool = "pointer";
        this.selectedToolElement = document.getElementsByClassName("tool-img")[0];

        const toolEventList = [
            "keyDown",
            "keyUp", 
            "keyPressed", 
            "clicked", 
            "mouseMoved", 
            "mouseDragged", 
            "mouseDown", 
            "mouseUp",
            "wheel"
        ];

        toolEventList.forEach((eventName) => {
            this.inputManager[eventName].add((...args) => {
                this.tools["pan"][eventName](...args);
                this.tools[this.selectedTool][eventName](...args);
            });
        })

        const canvas2dContextOptions = [
            ["Create Node Here", (e) => {console.log(e);}]
        ];
        
        //TODO: do context menu
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
        this.editorCamera2D._game = this.editor.sceneManager.game;
    
        this.editor.sceneManager.game.editorUpdate = () => {
            this.tools["pan"].update(); //this isnt even needed
            this.tools[this.selectedTool].update();
            this.tools[this.selectedTool].draw();
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
