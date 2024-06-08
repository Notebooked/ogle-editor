// TODO: MAKE TOOLDEFINITIONS FOR 3D LATER!!!! haha

import { gameCanvas, editorCamera2D, selectedTool } from "./stagemanager.js";
import { rootNode, canvasSelectedNode, canvasDeselected, selectedNodeIDList, getSelectedNodes } from "./scenemanager.js";
import { Rectangle2D, Rect, Color, Vec2, Vec3, Layer, Mat3, Drawable2D, Transform2D } from "../oglsrc/index.mjs";

export const editorGuiLayers = {};
const EDITOR_GUI_LAYER_INDEX = 1024;
let createEditorGuiLayer = id => {
    const l = new Layer();
    l.layerIdx = EDITOR_GUI_LAYER_INDEX;
    editorGuiLayers[id] = l;
    return l;
}

//MODE2D
const scrollZoomMultiplier = 1.05; //scrollZoomMarkiplier
const scrollZoomMax = 2, scrollZoomMin = 0.5;

let mousePos = null;
let mousePosNormalized = null;

function normalizeCanvasCoordinates(x, y) {
    return new Vec2((x / gameCanvas.clientWidth - 0.5) * 2, ((1 - y / gameCanvas.clientHeight) - 0.5) * 2);
}

function canvasTo2DWorld(x, y) { //TODO: FIX THIS 
    const v = normalizeCanvasCoordinates(x, y); //putting in center
    const m = new Mat3();
    m.copy(editorCamera2D.projectionViewMatrix);
    m.inverse();
    v.applyMatrix3(m);
    return v;
}

let draggingCanvas, selectingCanvas, draggingNode;
draggingCanvas = selectingCanvas = draggingNode = false;

let selectionStart = null; // in game world
let k = 1;
export function pointerEvent(e) {
    switch (e.type) {
        case "mousedown":
            if (e.button === 0) {
                checkMousecastObject(e);

                if (selectedNodeIDList.length === 0) {
                    selectingCanvas = true;

                    selectionStart = canvasTo2DWorld(e.clientX, e.clientY);
                } else {
                    draggingNode = true;
                }
            } else if (e.button === 1) {
                draggingCanvas = true;
            }

            break;
        case "mousemove":
            mousePos = canvasTo2DWorld(e.clientX, e.clientY);
            mousePosNormalized = normalizeCanvasCoordinates(e.clientX, e.clientY);

            if (draggingCanvas) {
                dragCanvas(e);
            }
            if (selectingCanvas) {
                checkSelectionRect();
            }

            break;
        case "mouseup":
            draggingCanvas = false;
            selectingCanvas = false;
            draggingNode = false;

            break;
        case "wheel":
            const v = new Vec2();
            v.copy(mousePos);
            
            if (e.deltaY > 0) {
                editorCamera2D.zoom /= scrollZoomMultiplier;
            } else {
                editorCamera2D.zoom *= scrollZoomMultiplier;
            }

            //TODO:make !!! automattic
            editorCamera2D.generateViewMatrix();
            mousePos = canvasTo2DWorld(e.clientX, e.clientY);

            v.sub(mousePos);
            v.multiply(k);
            editorCamera2D.position.add(v);

            editorCamera2D.zoom = Math.max(Math.min(editorCamera2D.zoom, scrollZoomMax), scrollZoomMin);

            //twice
            editorCamera2D.generateViewMatrix();
            mousePos = canvasTo2DWorld(e.clientX, e.clientY);

            break;
    }
}

let pointerLayer = createEditorGuiLayer("pointer");
let pointerRect = null; //TODO: change to selectionRect or sometng
export function pointerUpdate() {
    if (pointerRect === null){
        pointerRect = new Rectangle2D();
        pointerRect.color = new Color(0.3, 0.3, 1, 0.3);
        pointerRect.parent = pointerLayer;
    }

    if (selectingCanvas) {
        const r = new Rect({start: mousePos, end: selectionStart});
        r.fix();
        pointerRect.setByRect(r);
        pointerRect.visible = true;
    } else pointerRect.visible = false;
}

function checkSelectionRect() {
    let nodes = [];
    function rec(o) {
        if (o instanceof Drawable2D) nodes.push(o);
        o.children.forEach(rec);
    }
    if (rootNode) rec(rootNode);

    let res = [];

    const selectionRect = new Rect({start: selectionStart, end: mousePos});
    selectionRect.fix();
    nodes.forEach(node => {
        if (selectionRect.containsRect(node.getGlobalBounds())) res.push(node.nodeID);
    });

    canvasSelectedNode(res);
}

//checkMouseoverObject grr
function checkMousecastObject(e) {
    const coords = canvasTo2DWorld(e.clientX, e.clientY);

    let nodes = [];
    function rec(o) {
        if (o instanceof Drawable2D) nodes.push(o);
        o.children.forEach(rec);
    }
    if (rootNode) rec(rootNode);

    let res = null;
    nodes.forEach(drawable => {
        if (drawable.containsPoint(coords)) res = drawable;
    });

    if (res === null) canvasDeselected();
    else {
        canvasSelectedNode([res.nodeID]);
    }
}

function dragCanvas(e) {
    editorCamera2D.position.x -= e.movementX / (editorCamera2D.zoom);
    editorCamera2D.position.y += e.movementY / (editorCamera2D.zoom);
}

export function translateEvent(e) {

}
//make a canvas separate for each tool relative to the selected object 💯
let translateLayer = createEditorGuiLayer("translate");
let arrows = new Transform2D();
arrows.parent = translateLayer;
let translateArrowX = null; //TODO: change to selectionRect or sometng AND make clone function
let translateArrowY = null;
export function translateUpdate() {
    if (translateArrowX === null){
        translateArrowX = new Rectangle2D();//LINE2D NEXT!!!
        translateArrowX.rectSize = new Vec2(80, 4);
        translateArrowX.parent = arrows;//fix
        translateArrowX.color = new Color(1,0,0,1);
        translateArrowX.position.y -= 2;
        translateArrowY = new Rectangle2D();//LINE2D NEXT!!!
        translateArrowY.rectSize = new Vec2(4, 80);
        translateArrowY.parent = arrows;
        translateArrowY.color = new Color(0,1,0,1);
        translateArrowY.position.x -= 2;
    }
    if (getSelectedNodes().length !== 0) {
        arrows.visible = true;
        arrows.position = getSelectedNodes()[0].position;
    } else {
        arrows.visible = false;
    }
}

export function rotateEvent(e) {

}

export function rotateDraw() {

}