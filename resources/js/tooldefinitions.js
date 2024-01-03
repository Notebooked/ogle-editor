// TODO: MAKE TOOLDEFINITIONS FOR 3D LATER!!!! haha

let [mouseX, mouseY] = [0, 0];
let mousePos = null;

function normalizeCanvasCoordinates(x, y) {
    return [(x / gameCanvas.clientWidth - 0.5) * 2, ((1 - y / gameCanvas.clientHeight) - 0.5) * 2];
}

function canvasTo2DWorld(x, y) { //TODO: FIX THIS 
    const v = new Vec2(x - gameCanvas.clientWidth / 2, (gameCanvas.clientHeight - y) - gameCanvas.clientHeight / 2); //putting in center
    v.applyMatrix3(editorCamera2D.worldMatrix);
    return v;
}

let draggingCanvas, selectingCanvas, draggingNode;
draggingCanvas = selectingCanvas = draggingNode = false;

let selectionStartNormalized = [0, 0];
let selectionStart = null; // in game world

function pointerEvent(e) {
    switch (e.type) {
        case "mousedown":
            if (e.button === 0) {
                checkMousecastObject(e);

                if (selectedNodeIDList.length === 0) {
                    selectingCanvas = true;

                    selectionStartNormalized = normalizeCanvasCoordinates(e.clientX, e.clientY);
                    selectionStart = canvasTo2DWorld(e.clientX, e.clientY);
                } else {
                    draggingNode = true;
                }
            } else if (e.button === 1) {
                draggingCanvas = true;
            }

            break;
        case "mousemove":
            mouseX = e.clientX;
            mouseY = e.clientY;
            [mouseX, mouseY] = canvasTo2DWorld(e.clientX, e.clientY);
            mousePos = canvasTo2DWorld(e.clientX, e.clientY);

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
            [mouseX, mouseY] = normalizeCanvasCoordinates(e.clientX, e.clientY);

            const beforeRightBound = editorCamera.rightBound / editorCamera.zoom;
            const beforeTopBound = editorCamera.top / editorCamera.zoom;
        
            if (e.deltaY > 0) {
                editorCamera.zoom /= scrollZoomMultiplier;
            } else {
                editorCamera.zoom *= scrollZoomMultiplier;
            }
        
            const afterRightBound = editorCamera.rightBound / editorCamera.zoom;
            const afterTopBound = editorCamera.top / editorCamera.zoom;
        
            const difX = beforeRightBound - afterRightBound;
            const difY = beforeTopBound - afterTopBound;
        
            editorCamera.position.x += difX * mouseX;
            editorCamera.position.y += difY * mouseY;

            editorCamera.zoom = Math.max(Math.min(editorCamera.zoom, scrollZoomMax), scrollZoomMin);

            break;
    }
}

let pointerRect = null;
function pointerDraw() {
    //if (pointerRect === null) pointerRect = new Rectangle2D();

    //if (selectingCanvas) {
    //    pointerRect.rect = new Rect({start: selectionStart, end: mousePos});
//
//        pointerRect.draw({camera: editorCamera2D});
//    }
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

function translateEvent(e) {

}

function translateDraw() {
    if (selectedNodeIDList.length === 1) {
        const node = getSelectedNodes()[0];

        const nodePos = new Vec3();
        nodePos.copy(node.globalPosition);

        const theoriginquestionmark = nodePos;
        editorCamera.unproject(theoriginquestionmark);
        console.log(theoriginquestionmark);
        const thefreakingrightvector = new Vec3(0.1,0,0);
        editorCamera.unproject(thefreakingrightvector);

        drawLine(editorCamera, {start: new Vec2(theoriginquestionmark.x, theoriginquestionmark.y), end: new Vec2(thefreakingrightvector.x, thefreakingrightvector.y)});
    }
}//TODO MAKE STOP MAKE CAMERA DRAW DRAW NOT RELATIVE ON THE CAMERA