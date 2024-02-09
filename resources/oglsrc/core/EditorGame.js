import { Renderer } from './Renderer.js';
import { Camera } from './Camera.js';
import { Transform } from './Transform.js';
import { getGlContext } from './Canvas.js';
import { PhysicsEngine2D } from '../physics2d/PhysicsEngine2D.js';
import { InputManager } from './InputManager.js';

let then = 0;
let dt = 0;

export class EditorGame {
    #time = 0.0;
    #scene = null;
    activeCamera = null;
    activeCamera2D = null;

    constructor(scene = new Transform()) {
        this.setScene(scene);

        this.editorDrawTool = () => {};

        this.renderer = new Renderer(this, {alpha: false, premultipliedAlpha: false});
    }

    get time() {
        return this.#time;
    }

    editorloop(now) {
        this.scene.broadcast('editorLoop');

        this.renderer.renderSceneCamera();

        this.editorDrawTool();

        requestAnimationFrame((now) => {this.editorloop(now);});
    }

    mainloop() {
        this.scene.broadcast('start');

        requestAnimationFrame((now) => {this.loop(now);})
    }

    loop(now) {
        now *= 0.001;
        dt = now - then;
        then = now;

        this.#time += dt;

        this.scene.broadcast('update',dt);

        this.renderer.renderSceneCamera();
        
        requestAnimationFrame((now) => {this.loop(now);});
    }

    get scene() {
        return this.#scene;
    }
    setScene(scene) {
        this.#scene = scene;
        this.#scene._game = this;
    }
}