// TODO: MAKE TOOLDEFINITIONS FOR 3D LATER!!!! haha

import { PanTool } from "../oglsrc/editor/tools/PanTool.js";
import { PointerTool } from "../oglsrc/editor/tools/PointerTool.js";
import { TranslateTool } from "../oglsrc/editor/tools/TranslateTool.js";

export function initTools(editor) {
    return {
        pan: new PanTool(editor),
        pointer: new PointerTool(editor),
        translate: new TranslateTool(editor)
    }
}
