const
	tools = require("./tools"),
	path = require("path"),
	webpack = require("webpack"),
	AddAssetPlugin = require("add-asset-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	TerserPlugin = require("terser-webpack-plugin"),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'),
	AngularCompilerPlugin = require("@ngtools/webpack").AngularCompilerPlugin;
const mode = "production";

const paths = {
	context: path.join(__dirname, "../src"),
	build: path.join(__dirname, "../build")
};

module.exports = {
	context: paths.context,

	// devtool: "source-map",

	entry: {
		"polyfills": ["./polyfills.aot.ts"],
		"app": ["./main.ts", "./static/favicon.ico", "./static/root.scss"],
	},

	mode: mode,

	module: {
		rules: [
			{ test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, loader: "@ngtools/webpack" },
			{
				test: /\.html$/, use: {
					loader: "html-loader", options: {
						minimize: true,
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
			{ test: /\.txt$/, loader: "raw-loader" },
			{ test: /\.xlf$/, loader: "xml-minify-loader!@dcby/xliff-loader" }
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

	performance: { maxEntrypointSize: 1024 * 1024 * 4, maxAssetSize: 1024 * 1024 * 4 },

	plugins: [
		new CleanWebpackPlugin({

		}),
		new AngularCompilerPlugin({
			mainPath: "src/main.ts",
			// entryModule: "src/app/app.module#AppModule",
			// platform: 0,
			// sourceMap: true,
			tsConfigPath: "tsconfig.build.json",
			// skipCodeGeneration: true,
			compilerOptions: {
				fullTemplateTypeCheck: true
			}

		}),
		new AddAssetPlugin(
			"VERSION.txt",
			() => tools.getVersion()
		),
		new HtmlWebpackPlugin({
			hash: true,
			inject: "body",
			template: "index.html",
		}),
		new webpack.DefinePlugin({
			APP_VERSION: JSON.stringify(tools.getVersion()),
			"process.env.NODE_ENV": JSON.stringify(mode),
		}),
	],

	resolve: {
		extensions: [".ts", ".js"],
	},

	stats: {
		warningsFilter: /System.import/ // https://github.com/angular/angular/issues/21560
	}
};

console.log(`Build in '${module.exports.mode}' mode.`);
