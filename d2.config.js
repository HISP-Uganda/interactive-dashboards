const config = {
  type: "app",
  title:"Visualization Studio",
  entryPoints: {
    app: "./src/AppWrapper.js",
  },
  customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
