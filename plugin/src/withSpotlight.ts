import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
  withAppDelegate,
} from "@expo/config-plugins";

const pkg = require("react-native-spotlight-search/package.json");

const SPOTLIGHT_IMPORT = `#import "RCTSpotlightSearch.h"
`;
const SPOTLIGHT_ACTIVITY = `- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {`;

const SPOTLIGHT_ACTIVITY_ADD = `- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  [RCTSpotlightSearch handleContinueUserActivity:userActivity];
  return YES;`;

const modifyAppDelegate = (appDelegate: string) => {
  if (!appDelegate.includes(SPOTLIGHT_IMPORT)) {
    appDelegate = SPOTLIGHT_IMPORT + appDelegate;
  }
  const updatedAppDelegate = appDelegate.replace(
    SPOTLIGHT_ACTIVITY,
    SPOTLIGHT_ACTIVITY_ADD
  );
  return updatedAppDelegate;
};

const withSpotlightAppDelegate = (config: any) => {
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

const withSpotlight: ConfigPlugin<void> = (config) => {
  config = withSpotlightAppDelegate(config);
  return config;
};

export default createRunOncePlugin(withSpotlight, pkg.name, pkg.version);
