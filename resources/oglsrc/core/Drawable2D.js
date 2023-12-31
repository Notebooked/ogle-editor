import { Transform2D } from './Transform2D.js';
import { Mat4 } from '../math/Mat4.js';
import { Vec3 } from '../math/Vec3.js';
import { Color } from '../math/Color.js';
import { Mat3 } from '../math/Mat3.js';

export class Drawable2D extends Transform2D { //2d version of mesh
    constructor() {
        super();

        //storing draw function calls by saving their geometries in this list instead of creating new geometries every update
        this.drawGeometry = null;
        this.geometryColor = new Color(1, 1, 1, 1);
        this.program = null;
        this.zPosition = 0;
    }

    draw({ camera } = {}) { //draw function called by the renderer
        const geometry = this.drawGeometry;
        const color = this.geometryColor;
        const program = this.program;
        // Set the matrix uniforms
        program.uniforms.cameraMatrix = { value: camera.projectionMatrix };

        const c = new Mat3();
        c.copy(camera.viewMatrix);
        c.multiply(this.worldMatrix);
        program.uniforms.drawableMatrix = { value: c };

        program.uniforms.zPosition = { value: this.zPosition };

        program.uniforms.shapeColor = { value: color };
//console.log(camera.projectionMatrix, c);
        program.use({ flipFaces: false });
        geometry.draw({ program });
    }

    containsPoint(p) { return false; }
}