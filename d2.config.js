const config = {
    type: "app",
    name: "Campaign Dashboards",
    title: "Campaign Dashboards",
    description: "Campaign Dashboards",
    entryPoints: {
        app: "./src/AppWrapper.js",
    },
    customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
