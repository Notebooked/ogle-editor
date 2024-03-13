// TODO: MAKE TOOLDEFINITIONS FOR 3D LATER!!!! haha

import { editorGuiLayer, gameCanvas, editorCamera2D } from "./stagemanager.js";
import { rootNode, canvasSelectedNode, canvasDeselected, selectedNodeIDList } from "./scenemanager.js";

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

            //TODO:make that jawn automattic
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

let pointerRect = null; //TODO: change to selectionRect or sometng
export function pointerUpdate() {
    if (pointerRect === null){
        pointerRect = new Rectangle2D();
        pointerRect.color = new Color(0.3, 0.3, 1, 0.3);
        pointerRect.parent = editorGuiLayer;
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

export function translateDraw() {
    if (selectedNodeIDList.length === 1) {
        const node = getSelectedNodes()[0];

        const nodePos = new Vec3();
        nodePos.copy(node.globalPosition);

        const theoriginquestionmark = nodePos;
        editorCamera.unproject(theoriginquestionmark);
        const thefreakingrightvector = new Vec3(0.1,0,0);
        editorCamera.unproject(thefreakingrightvector);

        drawLine(editorCamera, {start: new Vec2(theoriginquestionmark.x, theoriginquestionmark.y), end: new Vec2(thefreakingrightvector.x, thefreakingrightvector.y)});
    }
}//TODO MAKE STOP MAKE CAMERA DRAW DRAW NOT RELATIVE ON THE CAMERA

export function rotateEvent(e) {

}

export function rotateDraw() {

}

export function rotateUpdate() { 
    
}