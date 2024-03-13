const globalKeyboardShortcutMap = new WeakMap();
function defineGlobalShortcut(key, callback = () => {}, {ctrlKey = false, shiftKey = false, altKey = false}) {
    console.log({key, ctrlKey, shiftKey, altKey});
    globalKeyboardShortcutMap.set({key, ctrlKey, shiftKey, altKey}, callback);
}

defineGlobalShortcut("c", () => {console.log("KIULL YOURSELF")}, {ctrlKey: true});

const processShortcutKeypress = e => {
    const iden = {key: e.key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey};
    console.log(iden);
    if (Object.keys(globalKeyboardShortcutMap).includes(iden)) {
        globalKeyboardShortcutMap[iden]();
    }
}
document.addEventListener("keydown", processShortcutKeypress);

//disable copy cut and paste
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());