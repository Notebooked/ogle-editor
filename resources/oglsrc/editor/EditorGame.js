import { Renderer } from '../core/Renderer.js';
import { Transform } from '../core/Transform.js';

let then = 0;
let dt = 0;

export class EditorGame {
    #time = 0.0;
    #scene = null;
    activeCamera = null;
    activeCamera2D = null;

    constructor(scene = new Transform()) {
        this.setScene(scene);

        this.editorUpdate = () => {};

        this.renderer = new Renderer(this, {alpha: false, premultipliedAlpha: false});

        this.running = true;
    }

    get time() {
        return this.#time;
    }

    editorloop(now) {
        this.scene.broadcast('editorLoop');

        this.renderer.renderSceneCamera();

        this.editorUpdate();

        if (this.running) requestAnimationFrame((now) => {this.editorloop(now);});
    }

    get scene() {
        return this.#scene;
    }
    setScene(scene) {
        this.#scene = scene;
        this.#scene._game = this;
    }
}