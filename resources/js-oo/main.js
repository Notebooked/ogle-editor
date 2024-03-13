import { loadProject } from "./projectloader.js";

export let projectFolder = null;
const templateDirectory = NL_CWD + "/resources/template-project";
export let projectJSON = null;

let newProjectName = null;

function resetProjectPrompt() {
    stopWarnEmptyFolder();

    projectFolder = null;

    const newProjectSpan = document.getElementById("new-project-span");

    newProjectSpan.innerHTML = "";
}

export async function newProject() {
    resetProjectPrompt();

    displayNewProjectPrompt();
}

export async function openProjectFolder() {
    projectFolder = await Neutralino.os.showFolderDialog("PICK A FOLDER NOW!!!");

    await loadProjectJSON();

    loadProject(projectJSON);
}

async function chooseNewProjectFolder() {//TODO: WHY IS THIS UNUSED
    projectFolder = await Neutralino.os.showFolderDialog("PICK A FOLDER NOW!!!");

    const newProjectSpan = document.getElementById("new-project-span");

    newProjectSpan.innerHTML = projectFolder;
}

function displayNewProjectPrompt() {
    const dialogContainer = document.getElementById("dialog-container");
    dialogContainer.classList.add("dialog-show");

    const newProjectDialog = document.getElementById("new-project-dialog");
    newProjectDialog.classList.add("dialog-show");
}

function cancelDialog() {
    const dialogContainer = document.getElementById("dialog-container");
    dialogContainer.classList.remove("dialog-show");

    const dialogs = document.getElementsByClassName("dialog-box");

    Array.from(dialogs).forEach((dialogBox) => {
        dialogBox.classList.remove("dialog-show");
    })
}

async function confirmCreateProject() {
    stopWarnEmptyFolder();

    try {
        const projectFolderFiles = await Neutralino.filesystem.readDirectory(projectFolder);

        if (projectFolderFiles.length > 2) {
            warnCreateProjectEmptyFolder();
            return;
        }
        await createProjectTemplate();

        loadProjectJSON();

        newProjectName = document.getElementById("new-project-name").value;

        loadProject(projectJSON);

        cancelDialog();
    } catch {
        warnCreateProjectGeneral();
    }
}

async function loadProjectJSON() {
    const projectContents = await Neutralino.filesystem.readFile(projectFolder + "/project.json");

    projectJSON = JSON.parse(projectContents);
}

function warnCreateProjectEmptyFolder() {
    const newProjectWarning = document.getElementById("new-project-warning");
    newProjectWarning.classList.add("warning-show");
    newProjectWarning.innerHTML = "The project folder must be empty upon creation.";
}

function warnCreateProjectGeneral() {
    const newProjectWarning = document.getElementById("new-project-warning");
    newProjectWarning.classList.add("warning-show");
    newProjectWarning.innerHTML = "Something went wrong.";
}

function stopWarnEmptyFolder() {
    const newProjectWarning = document.getElementById("new-project-warning");
    newProjectWarning.classList.remove("warning-show");
    newProjectWarning.innerHTML = "";
}

async function createProjectTemplate() {
    const templateProjectSource = await Neutralino.filesystem.readDirectory(templateDirectory);
    templateProjectSource.forEach((file) => {
        if (file["entry"] !== "." && file["entry"] !== "..") {
            console.log(templateDirectory + "/" + file["entry"]);
            Neutralino.filesystem.copyFile(templateDirectory + "/" + file["entry"], projectFolder + "/" + file["entry"]);
        }
    })
}


function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);
