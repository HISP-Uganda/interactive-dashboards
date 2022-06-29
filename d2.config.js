const config = {
  type: "app",

  entryPoints: {
    app: "./src/AppWrapper.js",
  },
  customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
