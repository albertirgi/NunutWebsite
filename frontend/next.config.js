const path = require("path");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
]);
const withOptimizedImages = require("next-optimized-images");
const withFonts = require("next-fonts");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

// next.js custom configuration goes here
const nextConfig = {
	env: {
		BACKEND_URL: "https://localhost:8080",
	},
	webpack: (config, options) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@iso/assets": path.join(__dirname, "assets"),
			"@iso/components": path.join(__dirname, "components"),
			"@iso/config": path.join(__dirname, "config"),
			"@iso/containers": path.join(__dirname, "containers"),
			"@iso/redux": path.join(__dirname, "redux"),
			"@iso/lib": path.join(__dirname, "library"),
			"@iso/ui": path.join(__dirname, "UI"),
		};
		return config;
	},
	webpack5:false,
};

// fix: prevents error when .css files are required by node
// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {};
// }

module.exports = withPlugins(
	[
		withTM,
		withOptimizedImages,
		withFonts,
		[
			withBundleAnalyzer,
			{
				analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
				analyzeBrowser: ["browser", "both"].includes(
					process.env.BUNDLE_ANALYZE
				),
				bundleAnalyzerConfig: {
					server: {
						analyzerMode: "static",
						reportFilename: "../bundles/server.html",
					},
					browser: {
						analyzerMode: "static",
						reportFilename: "../bundles/client.html",
					},
				},
			},
		],
	],
	nextConfig,
);
