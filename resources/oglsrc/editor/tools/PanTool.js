//TODO: figure out whether to put the default shortcuts here
// this "tool" is always active, though it is not selected

import { Vec2, Mat3 } from "../../index.mjs";
import { Tool } from "./Tool.js";

let mousePos = null;

export class PanTool extends Tool {
    constructor(...args) {
        super("pan", ...args);

        this.draggingCanvas = false;

        this.scrollZoomMultiplier = 1.1;
        this.scrollZoomMax = 20;
        this.scrollZoomMin = 0.1;
    }

    toolEvent(e) {
        switch (e.type) {
            case "mousedown":
                if (e.button === 1) { // this tool uses the middle mouse button
                    this.draggingCanvas = true;
                }

                break;
            case "mousemove":
                mousePos = this.canvasTo2DWorld(e.clientX, e.clientY);

                if (this.draggingCanvas) {
                    this.dragCanvas(e);
                }

                break;
            case "mouseup":
                this.draggingCanvas = false;

                break;
            case "wheel":
                const v = new Vec2();
                v.copy(mousePos);

                const cam = this.editor.stageManager.editorCamera2D;
                
                if (e.deltaY > 0) {
                    cam.zoom /= this.scrollZoomMultiplier;
                } else {
                    cam.zoom *= this.scrollZoomMultiplier;
                }

                //TODO:make !!! automattic
                cam.generateViewMatrix();
                mousePos = this.canvasTo2DWorld(e.clientX, e.clientY);

                v.sub(mousePos);
                // v.multiply(k);
                //cam.position.add(v);

                cam.zoom = Math.max(Math.min(cam.zoom, this.scrollZoomMax), this.scrollZoomMin);

                //twice
                cam.generateViewMatrix();
                mousePos = this.canvasTo2DWorld(e.clientX, e.clientY);

                break;
        }
    }

    dragCanvas(e) {
        const cam = this.editor.stageManager.editorCamera2D;
        cam.position.x -= e.movementX / (cam.zoom);
        cam.position.y += e.movementY / (cam.zoom);
    }

    normalizeCanvasCoordinates(x, y) {
        const canvas = this.editor.stageManager.gameCanvas;
        return new Vec2((x / canvas.clientWidth - 0.5) * 2, ((1 - y / canvas.clientHeight) - 0.5) * 2);
    }

    canvasTo2DWorld(x, y) { //TODO: FIX THIS 
        const v = this.normalizeCanvasCoordinates(x, y); //putting in center
        const m = new Mat3();
        m.copy(this.editor.stageManager.editorCamera2D.projectionViewMatrix);
        m.inverse();
        v.applyMatrix3(m);
        return v;
    }
}