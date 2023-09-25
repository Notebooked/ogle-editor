async function propertiesUpdateSelectedNode() {
    const nodeClass = await getClassFromSource(selectedNodeJSON.className);

    console.log(nodeClass, Object.keys(nodeClass));
}