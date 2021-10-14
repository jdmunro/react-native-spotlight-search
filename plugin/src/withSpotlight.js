"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const pkg = require("@react-native-voice/voice/package.json");
const SPOTLIGHT_IMPORT = `#import "RCTSpotlightSearch.h"`;
const SPOTLIGHT_ACTIVITY = `- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  [RCTSpotlightSearch handleContinueUserActivity:userActivity];
  return YES;
}`;
const modifyAppDelegate = (appDelegate) => {
    if (!appDelegate.includes(SPOTLIGHT_IMPORT)) {
        appDelegate = SPOTLIGHT_IMPORT + appDelegate;
        if (appDelegate.includes(SPOTLIGHT_ACTIVITY)) {
            appDelegate = appDelegate + SPOTLIGHT_ACTIVITY;
        }
        else {
            throw new Error("Failed to detect RCTSpotlightSearch in AppDelegate.m");
        }
    }
    return appDelegate;
};
const withSpotlightAppDelegate = (config) => {
    return (0, config_plugins_1.withAppDelegate)(config, (config) => {
        if (config.modResults.language === "objc") {
            config.modResults.contents = modifyAppDelegate(config.modResults.contents);
        }
        else {
            config_plugins_1.WarningAggregator.addWarningIOS("withSpotlightAppDelegate", "Swift AppDelegate files are not supported yet.");
        }
        return config;
    });
};
const withSpotlight = (config) => {
    config = withSpotlightAppDelegate(config);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withSpotlight, pkg.name, pkg.version);