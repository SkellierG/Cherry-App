const { getDefaultConfig } = require("expo/metro-config.js");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(process.cwd(), {
	// Do not disable CSS support when using Tailwind.
	isCSSEnabled: true,
});

config.resolver.sourceExts.push("js", "jsx", "ts", "tsx");

module.exports = withNativeWind(config, { input: "./global.css" });
