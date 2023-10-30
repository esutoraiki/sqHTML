module.exports = {
    multipass: true,
    plugins: [
        "removeXMLProcInst",
        "removeUselessDefs",
        "removeXMLNS",
        "removeStyleElement",
        "removeComments",
        "removeEmptyAttrs",
        "removeEditorsNSData",
        "convertStyleToAttrs",
        "cleanupIds"
    ]
};
