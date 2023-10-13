//projectFolder from main.js
let projectName = null;
let projectRoot = null;

async function createProjectFolderWatcher() {
    let watcherId = await Neutralino.filesystem.createWatcher(projectFolder);
    Neutralino.events.on('watchFile', (evt) => {
        if(watcherId == evt.detail.id) {
            loadProjectAssetsContainer();
        }
    });
}

async function loadProject() {
    //loadProjectName();

    //createProjectFolderWatcher();

    loadProjectAssetsContainer();
}

function changeProjectName(newName) {
    projectName = newName;
    loadProjectName();
}

function loadProjectName() {
    document.getElementById("project-name").innerHTML = projectName;
}