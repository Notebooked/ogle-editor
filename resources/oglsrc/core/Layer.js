import { Transform } from './Transform.js';

//TODO: FINISH THIS THING HAHAHA

export class Layer extends Transform {
    static editorProperties = [["layerIdx",false,"string"], ["useOwnCamera",true,"boolean"]];

    constructor() {
        super();
        this.layerIdx = 0;

        this.useOwnCamera = false;
    }
}