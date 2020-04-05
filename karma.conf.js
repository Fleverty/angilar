module.exports = function (config) {
	config.set({
		basePath: "",
		frameworks: ["jasmine"],
		files: [
			{ pattern: "./build/vendors.js" },
			{ pattern: "./build/polyfills.js" },
			{ pattern: "./src/test.ts" }
		],
		plugins: [
			require("karma-jasmine"),
			require("karma-chrome-launcher"),
			require("karma-webpack"),
			// require("karma-spec-reporter"),
			require("karma-jasmine-html-reporter")
		],
		preprocessors: {
			"./src/test.ts": ["webpack"]
		},
		webpack: require("./webpack/app-test.config"),
		reporters: ["progress", "kjhtml"],
		port: 0876,
		colors: true,
		autoWatch: true,
		browsers: ["Chrome"],
		client: {
			jasmine: {
				random: false
			}
		},
		singleRun: false
	});
};
