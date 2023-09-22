const contextMenuDiv = document.getElementById("context-menu")

function hideContextMenu() {
    contextMenuDiv.classList.remove("context-menu-show");
}

document.addEventListener("click", () => hideContextMenu());

function showContextMenu(e, options) {
    e.preventDefault();

    contextMenuDiv.classList.add("context-menu-show");
    contextMenuDiv.style.left = e.x + "px";
    contextMenuDiv.style.top = e.y + "px";

    contextMenuDiv.innerHTML = "";

    options.forEach((option) => {
        const optionName = option[0];
        const optionFunction = option[1];

        const optionButton = document.createElement("a");
        optionButton.innerHTML = optionName;
        optionButton.onclick = optionFunction;
        optionButton.classList.add("context-menu-option");

        contextMenuDiv.appendChild(optionButton);
    })
}