const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

/**
 * `output.path` below is the plugin root, not a build directory, so any default plugin that
 * writes a file named after the entry drops it straight into the repo. Three are dropped:
 *
 * - MiniCssExtractPlugin  replaced further down with one pinned to `dist/style.css`.
 * - CleanWebpackPlugin    would wipe the plugin root. Gone from @wordpress/scripts since v20;
 *                         the name is kept so the filter stays correct on either version.
 * - RtlCssPlugin          added in @wordpress/scripts v34. It emitted `style-dist-rtl.css`
 *                         into the plugin root, and nothing enqueues it -- this plugin has
 *                         never shipped an RTL stylesheet. Dropping it keeps the emitted set
 *                         identical to the pre-upgrade build.
 */
const plugins = defaultConfig.plugins.filter(
	(plugin) =>
		plugin.constructor.name != "MiniCssExtractPlugin" &&
		plugin.constructor.name != "CleanWebpackPlugin" &&
		plugin.constructor.name != "RtlCssPlugin"
);

let allEntries = {
	dist: "./src/index.js",
	"dist/frontend": "./src/frontend.js",
};

const config = {
	...defaultConfig,
	entry: allEntries,
	output: {
		path: path.resolve(__dirname),
		filename: "[name]/index.js",
	},
	plugins: [
		...plugins,
		new MiniCSSExtractPlugin({
			filename: "dist/style.css",
		}),
	],
};

module.exports = config;
