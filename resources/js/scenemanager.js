import * as oglClasses from "../oglsrc/index.mjs";
import { EditorGame } from "../oglsrc/editor/EditorGame.js";

const modeElements = document.getElementsByClassName("mode");

export class SceneManager {
    constructor(editor) {
        this.editor = editor;

        this.sceneJSON = null;

        this.selectedNodeIDList = []; //id of currently selected node
        this.rootNode = null;

        this.nodeIDTable = {};

        this.currentNodeID = 0; //variable for initializing id

        this.mode = "2D";

        this.game = new EditorGame();
        this.renderer = this.game.renderer;
    }

    getSelectedNodes() {
        const res = [];
    
        this.selectedNodeIDList.forEach(nodeID => res.push(this.nodeIDTable[nodeID]));
    
        return res;
    }

    async openSceneFile(path) {
        const sceneFile = await Neutralino.filesystem.readFile(path);
    
        this.sceneJSON = JSON.parse(sceneFile);
    
        await this.initializeNode(this.sceneJSON.root, null);
    
        this.reloadScene();
    }

    async initializeNode(nodeJSON, parentNode) {
        const newNode = await this.initializeNodeJSON(nodeJSON, parentNode);
        if (parentNode === null) {
            this.rootNode = newNode;
            this.game.setScene(this.rootNode);
        }
        this.nodeIDTable[this.currentNodeID] = newNode;
        this.currentNodeID++;
    
        for (var i = 0; i < nodeJSON.children.length; i++) {
            const childJSON = nodeJSON.children[i];
    
            await this.initializeNode(childJSON, newNode);
        }
    }

    async initializeNodeJSON(nodeJSON, parentNode) {
        const nodeClass = oglClasses[nodeJSON.className];
    
        const newNode = new nodeClass();
        
        newNode.nodeID = this.currentNodeID;
        newNode.nodeClass = nodeClass;
        newNode.name = nodeJSON.name;
        newNode.parent = parentNode;
    
        Object.keys(nodeJSON.initProperties).forEach(initProperty => {
            //TODO: maybe make a function for this; also god forbid the object be not in the oglclasses
            newNode[initProperty] = new oglClasses[nodeJSON.initProperties[initProperty].className](eval("("+nodeJSON.initProperties[initProperty].initProperties+")"));
        });
    
        nodeJSON.initFunctionCalls.forEach((initFunctionCall) => {
            eval("newNode." + initFunctionCall);
        });
    
        return newNode;
    }

    clearScene() {
        //TODO: make this
    }

    reloadScene() {
        this.editor.hierarchyManager.initializeHierarchy();
    }

    hierarchySelectedNode(nodeIDList) {
        this.selectedNodeIDList = nodeIDList;
    
        this.editor.propertiesManager.propertiesUpdateSelectedNode();
    }

    hierarchyDeselected() {
        this.selectedNodeIDList = [];
        this.editor.propertiesManager.propertiesUpdateDeselected();
    }

    canvasSelectedNode(nodeIDList) {
        this.selectedNodeIDList = nodeIDList;
    
        this.editor.hierarchyManager.hierarchyUpdateSelectedNode();
        this.editor.propertiesManager.propertiesUpdateSelectedNode();
    }

    canvasDeselected() {
        this.selectedNodeIDList = [];
    
        this.editor.hierarchyManager.hierarchyUpdateDeselected();
        this.editor.propertiesManager.propertiesUpdateDeselected();
    }

    propertiesChangedName(nodeID) {
        this.editor.hierarchyManager.hierarchyUpdateNodeName(nodeID);
    }

    setMode(modeIndex, modeName) {
        this.mode = modeName;
    
        modeElements[1 - modeIndex].classList.remove("active-mode");
        modeElements[modeIndex].classList.add("active-mode");
    }
}