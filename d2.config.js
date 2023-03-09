const config = {
  type: "app",
  name: "Visualisation Studio",
  title: "Visualisation Studio",
  description: "Visualisation Studio",
  entryPoints: {
    app: "./src/AppWrapper.js",
  },
  customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
