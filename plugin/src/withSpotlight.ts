import {
  ConfigPlugin,
  withAppDelegate,
  createRunOncePlugin,
  WarningAggregator,
} from "@expo/config-plugins";
const pkg = require("@react-native-voice/voice/package.json");

export type Props = {};

const SPOTLIGHT_IMPORT = `#import "RCTSpotlightSearch.h"`;

const SPOTLIGHT_ACTIVITY = `- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  [RCTSpotlightSearch handleContinueUserActivity:userActivity];
  return YES;
}`;

const modifyAppDelegate = (appDelegate: any) => {
  if (!appDelegate.includes(SPOTLIGHT_IMPORT)) {
    appDelegate = SPOTLIGHT_IMPORT + appDelegate;
    if (appDelegate.includes(SPOTLIGHT_ACTIVITY)) {
      appDelegate = appDelegate + SPOTLIGHT_ACTIVITY;
    } else {
      throw new Error("Failed to detect RCTSpotlightSearch in AppDelegate.m");
    }
  }
  return appDelegate;
};

const withSpotlightAppDelegate: ConfigPlugin = (config) => {
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

const withSpotlight: ConfigPlugin<Props> = (config) => {
  config = withSpotlightAppDelegate(config);
  return config;
};

export default createRunOncePlugin(withSpotlight, pkg.name, pkg.version);
