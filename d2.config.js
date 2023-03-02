const config = {
  type: "app",
  name: "manifesto",
  title: "Manifesto Dashboard",
  description: "Manifesto Dashboard",
  entryPoints: {
    app: "./src/AppWrapper.js",
  },
  customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;
