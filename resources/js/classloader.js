async function getClassFromSource(name) {
    const res = await import("../oglsrc/core/" + name + ".js");

    return res[name].prpoerptu;
}