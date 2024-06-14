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

    mouseDown(button) {
        if (button === 0) {
            this.checkMousecastObject();

            if (this.editor.sceneManager.selectedNodeIDList.length === 0) {
                this.selectingCanvas = true;

                this.selectionStart = this.canvasTo2DWorld(this.editor.stageManager.inputManager.mousePosition);
            } else {
                this.draggingNode = true;
            }
        }
    }

    mouseMoved(dx, dy) {
        mousePos = this.canvasTo2DWorld(this.editor.stageManager.inputManager.mousePosition);

        if (this.selectingCanvas) {
            this.checkSelectionRect();
        }
    }

    mouseUp(button) {
        this.selectingCanvas = false;
        this.draggingNode = false;
    }

    update() {
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
    
        this.editor.sceneManager.canvasSelectedNode(res);
    }
    
    //TODO: change to checkMouseoverObject
    checkMousecastObject() {
        const coords = this.canvasTo2DWorld(this.editor.stageManager.inputManager.mousePosition);
    
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
}
