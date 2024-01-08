import { Mat3 } from "../math/Mat3.js";
import { Rect } from "../math/Rect.js";
import { Vec2 } from "../math/Vec2.js";
import { Transform2D } from "./Transform2D.js";

export class Camera2D extends Transform2D {
    constructor() {
        super();

        this.zoom = 1;

        this.viewMatrix = new Mat3();

        this.projectionMatrix = new Mat3();
    }

    generateViewMatrix() {
        //WHY???? WHY 4???? TODO: FIX THIS IODIOT
        this.viewMatrix.inverse(this.worldMatrix);

        this.projectionMatrix.set(4 / gameCanvas.width,0,0,0,4 / gameCanvas.height,0,0,0,1);

        console.log(this.getFrustumBounds());
    }

    getFrustumBounds() {
        const start = new Vec2(-gameCanvas.clientWidth / 2, -gameCanvas.clientHeight / 2);
        start.applyMatrix3(this.worldMatrix);

        const end = new Vec2(gameCanvas.clientWidth / 2, gameCanvas.clientHeight / 2);
        end.applyMatrix3(this.worldMatrix);

        return new Rect({start, end});
    }

    drawableInBounds(node) {

    }
}

//TODO: FIX EVERYTHING THAT BREAKS ACCORDING TO THE RENDERER DPI
