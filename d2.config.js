const config = {
    type: "app",
    name: "Manifesto Dashboard",
    title: "Manifesto Dashboard",
    description: "Manifesto Dashboard",
    entryPoints: {
        app: "./src/AppWrapper.js",
    },
    customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
