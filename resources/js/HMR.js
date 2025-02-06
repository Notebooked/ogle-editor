// TODO: make sure directory stuff works

export class HMR {
    constructor(editor) {
        this.editor = editor;
        
        this.init();
    }
    async init() {
        let resourcesId = await Neutralino.filesystem.createWatcher("resources/js");
        let srcId = await Neutralino.filesystem.createWatcher("resources/oglsrc");
        
        Neutralino.events.on('watchFile', async (evt) => {
            if(resourcesId == evt.detail.id) {
                await Neutralino.filesystem.removeWatcher(resourcesId);
                location.reload();
            }
            if (srcId == evt.detail.id) {
                //this.editor.sceneManager.clearScene();
            }
        });
    }
}
