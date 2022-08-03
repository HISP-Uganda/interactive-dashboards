const config = {
	type: "app",
	name: "dv-studio",
	title: "Visualization Studio",
	description: "DHIS2 Data Visualization Studio",
	entryPoints: {
		app: "./src/AppWrapper.js",
	},
	customAuthorities: ["IDVT_ADMINISTRATION", "IDVT_DASHBOARD"],
};

module.exports = config;