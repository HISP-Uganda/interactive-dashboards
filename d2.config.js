const config = {
    type: "app",
    name: "Visualization Studio",
    title: "Visualization Studio",
    description: "Visualization Studio",
    entryPoints: {
        app: "./src/AppWrapper.js",
    },
    customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
