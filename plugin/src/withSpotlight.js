import { createRunOncePlugin } from "@expo/config-plugins";

const pkg = require("react-native-spotlight-search/package.json");

const withSpotlight = (config) => {
  return config;
};

export default createRunOncePlugin(withSpotlight, pkg.name, pkg.version);
