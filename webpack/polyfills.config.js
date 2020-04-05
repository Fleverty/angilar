const path = require("path"),
	TerserPlugin = require("terser-webpack-plugin");

const paths = {
	context: path.join(__dirname, "../src"),
	build: path.join(__dirname, "../build")
};

module.exports = {
	context: paths.context,

	devtool: "source-map",

	entry: { polyfills: "./polyfills.ts" },

	mode: "production",

	module: {
		rules: [
			{ test: /\.ts$/, loader: "awesome-typescript-loader?transpileOnly=true" }
		]
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true,
				terserOptions: { compress: { inline: false }, ecma: 6, output: { comments: false } }
			})
		]
	},

	output: {
		path: paths.build,
		filename: "[name].js"
	},

	performance: { maxEntrypointSize: 1024 * 1024 * 2, maxAssetSize: 1024 * 1024 * 2 },
};
