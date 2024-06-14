import { Layer } from "../../core/Layer.js";

// TODO: let tools define shortcuts using the shortcut manager and rewrite all the tools
// to use it instead of HTML cursor events

const EDITOR_GUI_LAYER_INDEX = 1024;

export class Tool {
    constructor(name, editor) {
        this.name = name;
        this.editor = editor;
        this.layer = new Layer();
        this.layer.layerIdx = EDITOR_GUI_LAYER_INDEX;
    }
    toolDraw() { //dont override
        const scene = this.editor.sceneManager;
        scene.renderer.render({ scene: this.layer, camera2D: scene.game.activeCamera2D, clear: false });
    }
    toolUpdate() {}
    toolEvent(e) {}
}