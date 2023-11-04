let mouseX, mouseY = 0; 

function normalizeCanvasCoordinates(x, y) {
    return [(x / gameCanvas.clientWidth - 0.5) * 2, ((1 - y / gameCanvas.clientHeight) - 0.5) * 2];
}

let draggingCanvas, selectingCanvas, draggingNode = false;

let selectionStartNormalized = [0, 0];

function pointerEvent(e) {
    switch (e.type) {
        case "mousedown":
            if (e.button === 0) {
                checkMousecastObject(e);

                if (selectedNodeID === null) {
                    selectingCanvas = true;

                    selectionStartNormalized = normalizeCanvasCoordinates(e.clientX, e.clientY);
                } else {
                    draggingNode = true;
                }
            } else if (e.button === 1) {
                draggingCanvas = true;
            }

            break;
        case "mousemove":
            [mouseX, mouseY] = normalizeCanvasCoordinates(e.clientX, e.clientY);

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
        
            editorCamera.zoom = Math.max(Math.min(editorCamera.zoom, scrollZoomMax), scrollZoomMin);
        
            const afterRightBound = editorCamera.rightBound / editorCamera.zoom;
            const afterTopBound = editorCamera.top / editorCamera.zoom;
        
            const difX = beforeRightBound - afterRightBound;
            const difY = beforeTopBound - afterTopBound;
        
            editorCamera.position.x += difX * mouseX;
            editorCamera.position.y += difY * mouseY;

            break;
    }
}

function pointerDraw() {
    const startX = selectionStartNormalized[0] * (editorCamera.rightBound / editorCamera.zoom);
    const startY = selectionStartNormalized[1] * (editorCamera.top / editorCamera.zoom);

    const endX = mouseX * (editorCamera.rightBound / editorCamera.zoom);
    const endY = mouseY * (editorCamera.top / editorCamera.zoom);

    const width = endX - startX;
    const height = endY - startY;

    const posX = startX + width / 2 + editorCamera.position.x;
    const posY = startY + height / 2 + editorCamera.position.y;

    if (selectingCanvas) {
        drawSquare(editorCamera, {
            position: new Vec2(posX, posY),
            size: new Vec2(Math.abs(width),
            Math.abs(height)),
            color: new Color(0.5, 0.5, 1, 0.4),
            fill: true
        });
        drawSquare(editorCamera, {
            position: new Vec2(posX, posY),
            size: new Vec2(Math.abs(width),
            Math.abs(height)),
            color: new Color(0.5, 0.5, 1, 1),
            fill: false,
            strokeWidth: 0.01
        });
    }
}

function checkSelectionRect() {
    let meshes = [];
    function rec(o) {
        if (o instanceof Mesh) meshes.push(o);
        o.children.forEach(rec);
    }
    if (rootNode) rec(rootNode);

    let res = null; //TODO: ADD mukltiple selections object
    let position = [];
    let vertices = [];

    meshes.forEach(mesh => {
        mesh.geometry.attributes.position.data.forEach(n => {
            position.push(n);

            if (position.length === 3) {
                let vertexPosition = new Vec3(...position);
    
                editorCamera.project(vertexPosition);

                vertices.push(vertexPosition);
    
                position = [];
            };
        });

        var valid = true;

        vertices.forEach(vertex => {
            if (Math.min(selectionStartNormalized[0], mouseX) >= vertex.x || vertex.x >= Math.max(selectionStartNormalized[0], mouseX) ||
            Math.min(selectionStartNormalized[1], mouseY) >= vertex.y || vertex.y >= Math.max(selectionStartNormalized[1], mouseY)) valid = false;
        });

        if (valid) res = mesh;

        vertices = [];
    });

    selectedNodeID = res ? res.id : null;
}

function checkMousecastObject(e) {
    let raycast = new Raycast();

    raycast.castMouse(editorCamera, normalizeCanvasCoordinates(e.clientX, e.clientY));

    let meshes = [];
    function rec(o) {
        if (o instanceof Mesh) meshes.push(o);
        o.children.forEach(rec);
    }
    if (rootNode) rec(rootNode);

    let hits = raycast.intersectMeshes(meshes);

    if (hits.length === 0) canvasDeselected();
    else {
        canvasSelectedNode(hits[0].nodeID);
    }
}

function dragCanvas(e) {
    editorCamera.position.x -= e.movementX / (editorCamera.zoom / 4);
    editorCamera.position.y += e.movementY / (editorCamera.zoom / 4);
}