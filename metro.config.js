const { getDefaultConfig } = require('expo/metro-config.js');
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(process.cwd());

config.resolver.sourceExts.push('js', 'jsx', 'ts', 'tsx');

module.exports = withNativeWind(config, { input: "./global.css" });