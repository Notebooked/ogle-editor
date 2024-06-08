import { initializeRenderer } from "./stagemanager.js";
import { initializeHierarchy, hierarchyUpdateSelectedNode, hierarchyUpdateDeselected, hierarchyUpdateNodeName } from "./hierarchymanager.js";
import { propertiesUpdateSelectedNode, propertiesUpdateDeselected } from "./propertiesmanager.js";

import * as oglClasses from "../oglsrc/index.mjs";
import { EditorGame } from "../oglsrc/core/EditorGame.js";

export let sceneJSON = null;

export let selectedNodeIDList = []; //id of currently selected node
export let rootNode = null;

export const nodeIDTable = {};

let currentNodeID = 0; //variable for initializing id

let mode = "2D";
let modeElements = document.getElementsByClassName("mode");

export let game = null;
export let renderer = null;

async function initialize() {
    //await loadAllClasses();

    game = new EditorGame();
    renderer = game.renderer;

    initializeRenderer();
}
initialize();

export function getSelectedNodes() {
    const res = [];

    selectedNodeIDList.forEach(nodeID => res.push(nodeIDTable[nodeID]));

    return res;
}

export async function openSceneFile(path) {
    const sceneFile = await Neutralino.filesystem.readFile(path);

    sceneJSON = JSON.parse(sceneFile);

    await initializeNode(sceneJSON.root, null);

    reloadScene();
}

async function initializeNode(nodeJSON, parentNode) {
    const newNode = await initializeNodeJSON(nodeJSON, parentNode);
    if (parentNode === null) {
        rootNode = newNode;
        game.setScene(rootNode);
    }
    nodeIDTable[currentNodeID] = newNode;
    currentNodeID++;

    for (var i = 0; i < nodeJSON.children.length; i++) {
        const childJSON = nodeJSON.children[i];

        await initializeNode(childJSON, newNode);
    }
}

async function initializeNodeJSON(nodeJSON, parentNode) {
    const nodeClass = oglClasses[nodeJSON.className];

    const newNode = new nodeClass();
    
    newNode.nodeID = currentNodeID;
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

function clearScene() {
    //make this
}

function reloadScene() {
    initializeHierarchy();
}

export function hierarchySelectedNode(nodeIDList) {
    selectedNodeIDList = nodeIDList;

    propertiesUpdateSelectedNode();
}

export function hierarchyDeselected() {
    selectedNodeIDList = [];
    propertiesUpdateDeselected();
}

export function canvasSelectedNode(nodeIDList) {
    selectedNodeIDList = nodeIDList;

    hierarchyUpdateSelectedNode();
    propertiesUpdateSelectedNode();
}

export function canvasDeselected() {
    selectedNodeIDList = [];

    hierarchyUpdateDeselected();
    propertiesUpdateDeselected();
}

export function propertiesChangedName(nodeID) {
    hierarchyUpdateNodeName(nodeID);
}

export function setMode(modeIndex, modeName) {
    mode = modeName;

    modeElements[1 - modeIndex].classList.remove("active-mode");
    modeElements[modeIndex].classList.add("active-mode");
}