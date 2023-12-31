import { Plane2D } from "../extras/Plane2D.js";
import { Rect } from "../math/Rect.js";
import { Vec2 } from "../math/Vec2.js";
import { Drawable2D } from "./Drawable2D.js";
import { Program } from "./Program.js";

const vertex1 = `
    //attribute vec2 uv;
    attribute vec2 position;

    uniform mat3 cameraMatrix;
    uniform mat3 drawableMatrix;
    uniform float zPosition;

    //varying vec2 vUv;

    void main() {
        //vUv = uv;
        
        vec3 p = cameraMatrix * drawableMatrix * vec3(position, 1.0);
        p.z = zPosition;

        gl_Position = vec4(p.xyz, 1.0);
    }
`;

const fragment1 = `
precision highp float;

//varying vec2 vUv;

uniform vec4 shapeColor;

void main() {
    gl_FragColor = shapeColor;
}
`;

export class Rectangle2D extends Drawable2D {
    constructor() {
        super();

        this._rect = new Rect({start: new Vec2(0, 0), end: new Vec2(10,10)});
        this._rect.onChange.add(() => this.updateGeometry());

        this.updateGeometry();

        this.program = new Program({
            vertex: vertex1,
            fragment: fragment1,
            transparent: true,
            cullFace: false
        });
    }

    setRectSize(width, height) {
        [this._rectWidth, this._rectHeight] = [width, height];
        this.updateGeometry();
    }

    updateGeometry() {
        this.drawGeometry = new Plane2D({rect: this.rect});
    }

    containsPoint(p) {
        return (this.position.x - this.rectWidth / 2 <= p.x &&
                p.x <= this.position.x + this.rectWidth / 2 &&
                this.position.y - this.rectHeight / 2 <= p.y &&
                p.y <= this.position.y + this.rectHeight)
    }

    get rect() {
        return this._rect;
    }
    set rect(value) {
        this._rect.set(value);
    }
}