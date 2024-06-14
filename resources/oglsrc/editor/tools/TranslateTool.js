import { Rectangle2D, Transform2D, Vec2, Color } from "../../index.mjs";
import { Tool } from "./Tool.js";

export class TranslateTool extends Tool {
    constructor(...args) {
        super("translate", ...args);

        this.arrows = new Transform2D();
        this.arrows.parent = this.layer;
        this.arrowX = new Rectangle2D();
        this.arrowY = new Rectangle2D();

        //TODO: line2d
        this.arrowX.rectSize = new Vec2(80, 4);
        this.arrowX.parent = this.arrows;//fix
        this.arrowX.color = new Color(1,0,0,1);
        this.arrowX.position.y -= 2;
        this.arrowY.rectSize = new Vec2(4, 80);
        this.arrowY.parent = this.arrows;
        this.arrowY.color = new Color(0,1,0,1);
        this.arrowY.position.x -= 2;

        //this.arrowSize = 1;
    }

    toolUpdate() {
        if (this.editor.sceneManager.getSelectedNodes().length !== 0) {
            this.arrows.visible = true;
            this.arrows.position = this.editor.sceneManager.getSelectedNodes()[0].position;
            this.arrows.scale.normalize().multiply(1 / this.editor.stageManager.editorCamera2D.zoom);
        } else {
            this.arrows.visible = false;
        }
    }
}
