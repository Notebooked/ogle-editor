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

        return this;
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

    containsPoint(p) {
        return (this.position.x <= p.x && p.x <= this.end.x && this.position.y <= p.y && p.y <= this.end.y);
    }

    containsRect(r) {
        return (this.position.x <= r.position.x && r.end.x <= this.end.x && this.position.y <= r.position.y && r.end.y <= this.end.y);
    }

    intersectsRect(r) {
        return (Math.min(this.end.x, r.end.x) - Math.max(this.position.x, r.position.x) > 0 &&
        Math.min(this.end.y, r.end.y) - Math.max(this.position.y, r.position.y) > 0)
    }

    grow(amount) {
        this.position.x -= amount;
        this.position.y -= amount;
        this.end.x += amount * 2;
        this.end.x += amount * 2;
    }

    clone() {
        return new Rect({start: this.position, end: this.end});
    }
}