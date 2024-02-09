import { Geometry } from '../core/Geometry.js';

// TODO: fix geometry not getting gl context

export class Plane2D extends Geometry {
    constructor({ rect, outline = false, attributes = {} } = {}) {
        // Generate empty arrays once
        const position = new Float32Array(8);
        //const normal = new Float32Array(num * 2);
        //const uv = new Float32Array(num * 2);
        const iSize = outline ? 4 : 6;
        const index = new Uint16Array(iSize);

        Plane2D.buildPlane(position, index, rect, outline);

        Object.assign(attributes, {
            position: { size: 2, data: position },
            //normal: { size: 2, data: normal },
            //uv: { size: 2, data: uv },
            index: { data: index },
        });

        super(attributes);
    }

    static buildPlane(position, index, rect, outline) {
        position[0] = rect.position.x;
        position[1] = rect.position.y;
        
        position[2] = rect.position.x;
        position[3] = rect.end.y;

        position[4] = rect.end.x;
        position[5] = rect.end.y;

        position[6] = rect.end.x;
        position[7] = rect.position.y;

        if (!outline) {
            index[0] = 0;
            index[1] = 1;
            index[2] = 2;
            index[3] = 0;
            index[4] = 3;
            index[5] = 2;
        } else {
            for (let i = 0; i < 4; i++) {
                index[i] = i;
            }
        }
    }
}
