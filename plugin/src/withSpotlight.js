const {
  createRunOncePlugin,
  withAppDelegate,
} = require("@expo/config-plugins");
const pkg = require("react-native-spotlight-search/package.json");

const SPOTLIGHT_IMPORT = `#import "RCTSpotlightSearch.h"`;

const SPOTLIGHT_ACTIVITY = `- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  [RCTSpotlightSearch handleContinueUserActivity:userActivity];
  return YES;
}`;

function modifyAppDelegate(appDelegate) {
  if (!appDelegate.includes(SPOTLIGHT_IMPORT)) {
    appDelegate = SPOTLIGHT_IMPORT + appDelegate;
    if (appDelegate.includes(SPOTLIGHT_ACTIVITY)) {
      appDelegate = appDelegate + SPOTLIGHT_ACTIVITY;
    } else {
      throw new Error("Failed to detect RCTSpotlightSearch in AppDelegate.m");
    }
  }
  return appDelegate;
}

const withSpotlightAppDelegate = (config) => {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language === "objc") {
      config.modResults.contents = modifyAppDelegate(
        config.modResults.contents
      );
    } else {
      WarningAggregator.addWarningIOS(
        "withSpotlightAppDelegate",
        "Swift AppDelegate files are not supported yet."
      );
    }
    return config;
  });
};

const withSpotlightSearch = (config) => {
  config = withSpotlightAppDelegate(config);
  return config;
};

const withSpotlight = createRunOncePlugin(
  withSpotlightSearch,
  pkg.name,
  pkg.version
);

module.exports = withSpotlight;
