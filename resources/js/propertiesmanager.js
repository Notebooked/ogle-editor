//TO not DO: this whole file should be murdered once gui is made
//note: i am not reimplementing the editor with gui components; the html version will be kept
import { Node } from "../oglsrc/index.mjs";

const propertyList = document.getElementById("property-list");

export class PropertiesManager {
    constructor(editor) {
        this.editor = editor;
    }

    propertiesUpdateSelectedNode() {
        propertyList.innerHTML = "";
        //TODO: it gets updated every mousedrag for selection tool
        //console.log("properties cleared");
    
        if (this.editor.sceneManager.getSelectedNodes().length > 0) {
            const classList = [];
            this.editor.sceneManager.getSelectedNodes().forEach(node => classList.push(node.nodeClass));
            const highestCommonClass = findCommonPrototype(classList);
        
            const classPropertyList = [];
        
            let currentClass = highestCommonClass;
            //TODO: i hate html node
            while (currentClass !== Node && currentClass !== undefined) {
                if (currentClass.editorProperties) {  //DO MULTUIPLE SELECTED NODes
                    currentClass.editorProperties.forEach((editorProperty) => {
                        if (!classPropertyList.includes(editorProperty)) {
                            classPropertyList.push(editorProperty);
                        }
                    })
                }
        
                currentClass = Object.getPrototypeOf(currentClass);
            }
        
            classPropertyList.forEach(editorProperty => this.createEditorPropertyContainer(editorProperty));
        }
    }

    propertiesUpdateDeselected() {
        propertyList.innerHTML = "";
    }

    createEditorPropertyString(propertyName, propertyValue, canEdit, propertyContainer) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);
    
        const propertyValueElement = document.createElement("input");
        propertyValueElement.type = "text";
        propertyValueElement.name = "property-input";
        propertyValueElement.classList.add("property-value", "property-value-string");
        propertyValueElement.value = propertyValue;
        if (!canEdit) propertyValueElement.disabled = true;
    
        if (canEdit) propertyValueElement.onchange = () => this.propertyValueElementChangedString(propertyName, propertyValueElement, this.editor.sceneManager.selectedNodeIDList);
        propertyContainer.appendChild(propertyValueElement);
    }

    propertyValueElementChangedString(propertyName, propertyValueElement, nodeIDList) {
        const newValue = propertyValueElement.value;
    
        if (propertyName === "name" && newValue.trim() === "") {
            propertyValueElement.focus();
        } else {
            propertyValueElement.blur(); //deselect entry
    
            nodeIDList.forEach(nodeID => {
                const node = this.editor.sceneManager.nodeIDTable[nodeID];
    
                node[propertyName] = propertyValueElement.value;
    
                if (propertyName === "name") this.editor.sceneManager.propertiesChangedName(nodeID);
            });
        }
    }

    createEditorPropertyBoolean(propertyName, propertyValue, canEdit, propertyContainer) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);
    
        const propertyValueElement = document.createElement("input");
        propertyValueElement.type = "checkbox";
        propertyValueElement.name = "property-input";
        propertyValueElement.classList.add("property-value", "property-value-boolean");
        propertyValueElement.checked = propertyValue;
        if (!canEdit) propertyValueElement.disabled = true;
    
        if (canEdit) propertyValueElement.onchange = () => this.propertyValueElementChangedBoolean(propertyName, propertyValueElement, this.editor.sceneManager.selectedNodeIDList);
        propertyContainer.appendChild(propertyValueElement);
    }

    propertyValueElementChangedBoolean(propertyName, propertyValueElement, nodeIDList) {
        const newValue = propertyValueElement.checked;
    
        propertyValueElement.blur(); //deselect entry
    
        nodeIDList.forEach(nodeID => {
            const node = this.editor.sceneManager.nodeIDTable[nodeID];
    
            node[propertyName] = newValue;
        });
    }

    createEditorPropertyVectorEntry(vectorComponent, propertyName, propertyValue, canEdit, propertyValueContainer) {
        const propertyValueElement = document.createElement("input");
        propertyValueElement.type = "number";
        propertyValueElement.name = "property-input";
        propertyValueElement.classList.add("property-value", "property-value-number");
        propertyValueElement.value = "" + propertyValue[vectorComponent];
    
        if (!canEdit) propertyValueElement.disabled = true;
        if (canEdit) propertyValueElement.onchange = () => this.propertyValueElementChangedVector3(propertyName, propertyValueElement, this.editor.sceneManager.selectedNodeIDList, vectorComponent);
    
        propertyValueContainer.appendChild(propertyValueElement);
    }

    createEditorPropertyNumber(propertyName, propertyValue, canEdit, propertyContainer) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);

        const propertyValueElement = document.createElement("input");
        propertyValueElement.type = "number";
        propertyValueElement.name = "property-input";
        propertyValueElement.classList.add("property-value", "property-value-number");
        propertyValueElement.value = propertyValue;
    
        if (!canEdit) propertyValueElement.disabled = true;
        if (canEdit) propertyValueElement.onchange = () => this.propertyValueElementChangedNumber(propertyName, propertyValueElement, this.editor.sceneManager.selectedNodeIDList);
    
        propertyContainer.appendChild(propertyValueElement);
    }

    propertyValueElementChangedNumber(propertyName, propertyValueElement, nodeIDList) {
        nodeIDList.forEach(nodeID => {
            const node = this.editor.sceneManager.nodeIDTable[nodeID];

            node[propertyName] = parseFloat(propertyValueElement.value);
        });
    }

    createEditorPropertyVector2(propertyName, propertyValue, canEdit, propertyContainer) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);
    
        const propertyValueContainer = document.createElement("div");
        propertyValueContainer.classList.add("property-value", "property-value-vector");
    
        this.createEditorPropertyVectorEntry("x", propertyName, propertyValue, canEdit, propertyValueContainer);
        this.createEditorPropertyVectorEntry("y", propertyName, propertyValue, canEdit, propertyValueContainer);
    
        propertyContainer.appendChild(propertyValueContainer);
    }

    propertyValueElementChangedVector2(propertyName, propertyValueElement, nodeIDList, vectorComponent) {
        const newValue = parseFloat(propertyValueElement.value);
    
        propertyValueElement.blur(); //deselect entry
    
        nodeIDList.forEach(nodeID => {
            const node = this.editor.sceneManager.nodeIDTable[nodeID];
    
            node[propertyName][vectorComponent] = newValue;
        });
    }

    createEditorPropertyVector3(propertyName, propertyValue, canEdit, propertyContainer) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);
    
        const propertyValueContainer = document.createElement("div");
        propertyValueContainer.classList.add("property-value", "property-value-vector");
    
        this.createEditorPropertyVectorEntry("x", propertyName, propertyValue, canEdit, propertyValueContainer);
        this.createEditorPropertyVectorEntry("y", propertyName, propertyValue, canEdit, propertyValueContainer);
        this.createEditorPropertyVectorEntry("z", propertyName, propertyValue, canEdit, propertyValueContainer);
    
        propertyContainer.appendChild(propertyValueContainer);
    }

    propertyValueElementChangedVector3(propertyName, propertyValueElement, nodeIDList, vectorComponent) {
        const newValue = parseFloat(propertyValueElement.value);
    
        propertyValueElement.blur(); //deselect entry
    
        nodeIDList.forEach(nodeID => {
            const node = this.editor.sceneManager.nodeIDTable[nodeID];
    
            node[propertyName][vectorComponent] = newValue;
        });
    }

    //TODO: i dont think we need any of this function stuff
    createEditorPropertyFunctionEntry(argumentName, current) {

    }

    createEditorPropertyFunction(propertyName, propertyValue, canEdit, propertyContainer, argumentList) {
        const propertyNameSpan = document.createElement("span");
        propertyNameSpan.classList.add("property-name");
        propertyNameSpan.innerHTML = propertyName;
        propertyContainer.appendChild(propertyNameSpan);
    
        const propertyValueContainer = document.createElement("div");
        propertyValueContainer.classList.add("property-value", "property-value-vector");
    
        argumentList.forEach(argumentName => this.createEditorPropertyFunctionEntry(argumentName));
    
        propertyContainer.appendChild(propertyValueContainer);
    }

    propertyValueElementChangedFunction(propertyName, propertyValueElement, nodeIDList, vectorComponent) {
        const newValue = parseFloat(propertyValueElement.value);
    
        propertyValueElement.blur(); //deselect entry
    
        nodeIDList.forEach(nodeID => {
            const node = this.editor.sceneManager.nodeIDTable[nodeID];
    
            node[propertyName][vectorComponent] = newValue;
        });
    }

    createEditorPropertyContainer(editorProperty) {
        const propertyContainer = document.createElement("div");
        propertyContainer.classList.add("property-container");
    
        const firstSelectedNode = this.editor.sceneManager.getSelectedNodes()[0];
    
        if (editorProperty[2] === "string") {
            this.createEditorPropertyString(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer);
        } else if (editorProperty[2] === "number") {
            this.createEditorPropertyNumber(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer);
        } else if (editorProperty[2] === "boolean") {
            this.createEditorPropertyBoolean(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer);
        } else if (editorProperty[2] === "vector2") {
            this.createEditorPropertyVector2(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer);
        } else if (editorProperty[2] === "vector3") {
            this.createEditorPropertyVector3(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer);
        } else if (editorProperty[2] === "function") {
            this.createEditorPropertyFunction(editorProperty[0], firstSelectedNode[editorProperty[0]], editorProperty[1], propertyContainer, editorProperty[2]);
        }
    
        propertyList.appendChild(propertyContainer);
    }
}

//TODO: never shoulda written this code
function findCommonPrototype(classes) {
    let currentCommonPrototype = classes[0];

    // Iterate through the remaining classes
    for (let i = 1; i < classes.length; i++) {
        const currentCommonPrototypeChain = getPrototypeChain(currentCommonPrototype);

        // Get the prototype chain for the current class
        const currentPrototypeChain = getPrototypeChain(classes[i]);

        // Find the common prototype between the current class and the accumulated common prototype
        currentCommonPrototype = findCommonElement(currentPrototypeChain, currentCommonPrototypeChain);
    }

    return currentCommonPrototype;
}

// Helper function to get the prototype chain of a class
export function getPrototypeChain(cls) {
    const prototypeChain = [cls];
    let currentPrototype = Object.getPrototypeOf(cls);

    while (currentPrototype !== null) {
        prototypeChain.push(currentPrototype);
        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }

    return prototypeChain;
}

// Helper function to find the common element between two arrays
function findCommonElement(arr1, arr2) {
    for (const element of arr1) {
        if (arr2.includes(element)) {
            return element;
        }
    }

    return null;
}