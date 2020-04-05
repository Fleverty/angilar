const
	path = require("path"),
	tools = require("./tools"),
	webpack = require("webpack"),
	AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin"),
	AddAssetPlugin = require("add-asset-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	TerserPlugin = require("terser-webpack-plugin"),
	PrettierPlugin = require("prettier-webpack-plugin"),
	FailOnErrorsPlugin = require("fail-on-errors-webpack-plugin"),
	TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin"),
	WatchIgnorePlugin = webpack.WatchIgnorePlugin;

const mode = process.env.NODE_ENV || "development";

const paths = {
	context: path.resolve(__dirname, "../src"),
	build: path.resolve(__dirname, "../build")
};

module.exports = {
	context: paths.context,

	devtool: "source-map",

	entry: {
		"app": ["./main.ts", "./static/favicon.ico", "./static/root.scss"],
	},

	mode: mode,

	module: {
		rules: [
			{ test: /\.ts$/, enforce: "pre", loader: "eslint-loader?fix=true" },
			{ test: /\.ts$/, loader: "awesome-typescript-loader?useCache=true!angular-router-loader!angular2-template-loader" },
			{
				test: /\.html$/, use: {
					loader: "html-loader", options: {
						// minimize: true,
						caseSensitive: true,
						collapseBooleanAttributes: false,
						collapseInlineTagWhitespace: false,
						collapseWhitespace: true,
						conservativeCollapse: false,
						keepClosingSlash: false,
						removeAttributeQuotes: false,
						removeComments: true,
						sortAttributes: true,
						sortClassName: true
					}
				}
			},
			{ test: /\.woff2$/, loader: "file-loader?name=[path][name].[ext]" },
			{ test: /\.ttf$/, loader: "file-loader?name=[path][name].[ext]" },
			{
				test: /\.scss$/, oneOf: [
					{ test: /root\.scss$/, loader: "style-loader!css-loader?url!resolve-url-loader!postcss-loader!sass-loader?{sourceMap:true}" },
					{ loader: "to-string-loader!css-loader?url!resolve-url-loader!postcss-loader!sass-loader?{sourceMap:true}" }
				]
			},
			{ test: /\.ico$/, loader: "file-loader?name=[path][name].[ext]" },
			{ test: /\.svg$/, loader: "file-loader?name=[path][name].[ext]" },
			{ test: /\.png$/, loader: "file-loader?name=[path][name].[ext]" },
			{ test: /\.jpg$/, loader: "file-loader?name=[path][name].[ext]" },
			// { test: /\.svg$/, loader: "raw-loader!xml-minify-loader" },
			{ test: /\.txt$/, loader: "raw-loader" },
			{ test: /\.xlf$/, loader: "xml-minify-loader!@dcby/xliff-loader" },
			{ test: /\.yaml$/, loader: "json-loader!yaml-loader" },
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
		filename: "[name].js?[hash:6]"
	},

	performance: { maxEntrypointSize: 1024 * 1024 * 2, maxAssetSize: 1024 * 1024 * 2 },

	plugins: [
		new FailOnErrorsPlugin({
			failOnWarnings: process.env.FAIL_ON_WARNING,
		}),
		new PrettierPlugin({
			extensions: [".scss"],
			useTabs: true,
			printWidth: 80,
		}),
		new AddAssetPlugin(
			"VERSION.txt",
			() => tools.getVersion()
		),
		new HtmlWebpackPlugin({
			chunks: ["app"],
			hash: true,
			inject: "body",
			template: "index.html",
		}),
		new AddAssetHtmlPlugin({
			filepath: path.resolve(paths.build, "vendors.js"),
			includeRelatedFiles: false,
			hash: true,
		}),
		new AddAssetHtmlPlugin({
			filepath: path.resolve(paths.build, "polyfills.js"),
			includeRelatedFiles: false,
			hash: true,
		}),
		new webpack.DefinePlugin({
			APP_VERSION: webpack.DefinePlugin.runtimeValue(() => JSON.stringify(tools.getVersion()), []),
			"process.env.NODE_ENV": JSON.stringify(mode),
			FAIL_ON_WARNING: JSON.stringify(true)
		}),
		new webpack.DllReferencePlugin({
			manifest: require(path.resolve(paths.build, "vendors.manifest.json"))
		}),
		new WatchIgnorePlugin([paths.build]),
	],

	resolve: {
		extensions: [".ts", ".js"],
		plugins: [new TsconfigPathsPlugin()]
	}
};

console.log(`Build in '${module.exports.mode}' mode.`);
console.log("failOnWarning :", process.env.FAIL_ON_WARNING);
