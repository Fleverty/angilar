const path = require("path"),
	webpack = require("webpack"),
	TerserPlugin = require("terser-webpack-plugin");

const paths = {
	context: path.join(__dirname, "../src"),
	build: path.join(__dirname, "../build")
};

module.exports = {
	context: paths.context,

	devtool: "source-map",

	entry: {
		vendors: ["./vendors.ts"]
	},

	mode: "production",

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "awesome-typescript-loader?transpileOnly=true&module=commonjs" // 'commonjs' turns off tree-shaking. Also it produces smaller image.
			}
		]
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true,
				terserOptions: { compress: { inline: false }, ecma: 6, output: { comments: false } }
			})
		],
		// sideEffects: false // turn-off tree-shaking
	},

	output: {
		path: paths.build,
		filename: "[name].js",
		library: "[name]",
	},

	performance: { maxEntrypointSize: 1024 * 1024 * 2, maxAssetSize: 1024 * 1024 * 2 },

	plugins: [
		// separate by module
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)fesm5/
		),
		new webpack.DllPlugin({
			path: path.join(paths.build, "[name].manifest.json"),
			name: "[name]"
		})
	],

	resolve: { extensions: [".ts", ".js"] },

	stats: {
		warningsFilter: /System.import/ // https://github.com/angular/angular/issues/21560
	},
};
