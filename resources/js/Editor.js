import { AssetManager } from "./AssetManager.js";
import { HierarchyManager } from "./HierarchyManager.js";
import { ProjectManager } from "./ProjectManager.js";
import { PropertiesManager } from "./PropertiesManager.js";
import { SceneManager } from "./SceneManager.js";
import { StageManager } from "./StageManager.js";

export class Editor {
    constructor() {
        this.assetManager = new AssetManager(this);
        this.hierarchyManager = new HierarchyManager(this);
        this.projectManager = new ProjectManager(this);
        this.propertiesManager = new PropertiesManager(this);
        this.sceneManager = new SceneManager(this);
        this.stageManager = new StageManager(this);
    }

    start() {
        this.stageManager.initializeRenderer();
    }
}
