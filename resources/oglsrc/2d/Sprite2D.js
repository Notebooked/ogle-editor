import { Plane } from '../extras/Plane.js';
import { Program } from '../core/Program.js';
import { TextureLoader } from '../extras/TextureLoader.js';
import { Drawable2D } from './Drawable2D.js';

export class Sprite2D extends Drawable2D {
    #texture = null;

    static editorProperties = [];

    constructor(name, parent = null) {
        super({ geometry: new Plane({width:1, height:1}), program: new Program({
            vertex,
            fragment,
            uniforms: {
                tMap: { value: TextureLoader.load({src: 'grimacing-face.png'})},
            },
            cullFace: null,
            transparent: true,
        }) });
    }
    get texture() {
        return this.#texture;
    }
    set texture(value) {
        this.setTexture(value);
    }
    setTexture(value) {
        this.#texture = value;
        this.program = new Program({
            vertex,
            fragment,
            uniforms: {
                tMap: { value: this.#texture },
            },
            cullFace: null,
            transparent: true,
        });
    }
}

/*
this.transparent = transparent;
        this.cullFace = cullFace;
        this.frontFace = frontFace;
        this.depthTest = depthTest;
        this.depthWrite = depthWrite;
        this.depthFunc = depthFunc;
        this.blendFunc = {};
        this.blendEquation = {};
*/