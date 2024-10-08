import * as ColorFunc from './functions/ColorFunc.js';

// Color stored as an array of RGB decimal values (between 0 > 1)
// Constructor and set method accept following formats:
// new Color() - Empty (defaults to black)
// new Color([0.2, 0.4, 1.0]) - Decimal Array (or another Color instance)
// new Color(0.7, 0.0, 0.1) - Decimal RGB values
// new Color('#ff0000') - Hex string
// new Color('#ccc') - Short-hand Hex string
// new Color(0x4f27e8) - Number
// new Color('red') - Color name string (short list in ColorFunc.js)

export class Color extends Array { //TODO: i swear to god make onchange
    constructor(color) {
        if (Array.isArray(color)) return super(...color);
        return super(...ColorFunc.parseColor(...arguments));
    }

    get r() {
        return this[0];
    }

    get g() {
        return this[1];
    }

    get b() {
        return this[2];
    }

    get a() {
        return this[3];
    }

    set r(v) {
        this[0] = v;
    }

    set g(v) {
        this[1] = v;
    }

    set b(v) {
        this[2] = v;
    }

    set a(v) {
        this[3] = v;
    }

    set(color) {
        if (Array.isArray(color)) return this.copy(color);
        return this.copy(ColorFunc.parseColor(...arguments));
    }

    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        this[3] = v[3];
        return this;
    }

    clone() {
        const newObj = new Color();
        newObj.copy(this);
        return newObj;
    }
}
