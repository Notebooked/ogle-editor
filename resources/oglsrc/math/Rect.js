import { Signal } from "../core/Signal.js";
import { Vec2 } from "./Vec2.js";

export class Rect {
    constructor({start, end, x, y, width, height}) {
        this.position = start ? start : new Vec2(x, y); //TODO: getters and setters for these
        this.end = end ? end : new Vec2(x + width, y + height);

        this._size = new Vec2();
        this._size.onChange.add(() => {
            this.end = new Vec2(this.position.x + this._size.x, this.position.y + this._size.y);
        });

        this.onChange = new Signal();
    }

    fix() {
        const x1 = Math.min(this.position.x, this.end.x);
        const x2 = Math.max(this.position.x, this.end.x);
        const y1 = Math.min(this.position.y, this.end.y);
        const y2 = Math.max(this.position.y, this.end.y);

        this.position = new Vec2(x1,y1);
        this.end = new Vec2(x2,y2);

        this.onChange.fire();
    }

    get size() {
        this._size.copy(this.end);
        this._size.sub(this.position);

        return this._size;
    }
    set size(value) {
        this._size.set(value);

        this.onChange.fire();
    }

    set(o) {
        this.position = o.position;
        this.end = o.end;

        this.onChange.fire();
    }
}