import { Tool } from "./Tool.js";
import { Rectangle2D, Vec2, Mat3, Color, Rect, Drawable2D } from "../../index.mjs";

//TODO: move this into a mouse class
let mousePos = null;

export class PointerTool extends Tool {
    constructor(...args) {
        super("pointer", ...args);

        this.rect = new Rectangle2D();
        this.rect.color = new Color(0.3, 0.3, 1, 0.3);
        this.rect.parent = this.layer;

        this.selectingCanvas = false;
        this.draggingNode = false;

        this.selectionStart = null;

        this.scrollZoomMultiplier = 1.1;
        this.scrollZoomMax = 20;
        this.scrollZoomMin = 0.1;
    }

    toolEvent(e) {
        switch (e.type) {
            case "mousedown":
                if (e.button === 0) {
                    this.checkMousecastObject(e);

                    if (this.editor.sceneManager.selectedNodeIDList.length === 0) {
                        this.selectingCanvas = true;

                        this.selectionStart = this.canvasTo2DWorld(e.clientX, e.clientY);
                    } else {
                        this.draggingNode = true;
                    }
                }

                break;
            case "mousemove":
                mousePos = this.canvasTo2DWorld(e.clientX, e.clientY);

                if (this.selectingCanvas) {
                    this.checkSelectionRect();
                }

                break;
            case "mouseup":
                this.selectingCanvas = false;
                this.draggingNode = false;

                break;
        }
    }

    toolUpdate() {
        if (this.selectingCanvas) {
            const r = new Rect({start: mousePos, end: this.selectionStart});
            r.fix();
            this.rect.setByRect(r);
            this.rect.visible = true;
        } else this.rect.visible = false;
    }

    checkSelectionRect() {
        let nodes = [];
        function rec(o) {
            if (o instanceof Drawable2D) nodes.push(o);
            o.children.forEach(rec);
        }
        const rootNode = this.editor.sceneManager.rootNode;
        if (rootNode) rec(rootNode);
    
        let res = [];
    
        const selectionRect = new Rect({start: this.selectionStart, end: mousePos});
        selectionRect.fix();
        nodes.forEach(node => {
            if (selectionRect.containsRect(node.getGlobalBounds())) res.push(node.nodeID);
        });
    
        //TODO: why the flip flop is this a single object while below is an array
        this.editor.sceneManager.canvasSelectedNode(res);
    }
    
    //TODO: change to checkMouseoverObject
    checkMousecastObject(e) {
        const coords = this.canvasTo2DWorld(e.clientX, e.clientY);
    
        let nodes = [];
        function rec(o) {
            if (o instanceof Drawable2D) nodes.push(o);
            o.children.forEach(rec);
        }
        const rootNode = this.editor.sceneManager.rootNode;
        if (rootNode) rec(rootNode);
    
        let res = null;
        nodes.forEach(drawable => {
            if (drawable.containsPoint(coords)) res = drawable;
        });
    
        if (res === null) this.editor.sceneManager.canvasDeselected();
        else {
            this.editor.sceneManager.canvasSelectedNode([res.nodeID]);
        }
    }

    normalizeCanvasCoordinates(x, y) {
        const canvas = this.editor.stageManager.gameCanvas;
        return new Vec2((x / canvas.clientWidth - 0.5) * 2, ((1 - y / canvas.clientHeight) - 0.5) * 2);
    }
    
    //TODO: make a standard Tool or utility function
    canvasTo2DWorld(x, y) { //TODO: FIX THIS 
        const v = this.normalizeCanvasCoordinates(x, y); //putting in center
        const m = new Mat3();
        m.copy(this.editor.stageManager.editorCamera2D.projectionViewMatrix);
        m.inverse();
        v.applyMatrix3(m);
        return v;
    }
}