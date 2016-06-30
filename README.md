# react-native-spotlight-search
A React Native module for iOS that provides Spotlight search functionality. This allows you to index content from within your React Native app so that it appears in the iOS device's Spotlight search index, potentially increasing the exposure of your app.

Please note this is an early version and the features and API are likely to change.

# Current Features
* Adding items.
* Updating items.
* Deleting items.
* Register a callback to handle when a search item is tapped.
* Limited support for images.

![Spotlight Search Demo](http://i.imgur.com/tbI3yAs.gif)

# Installation

`$ npm install react-native-vector-icons --save`

## iOS 

### With [`rnpm`](https://github.com/rnpm/rnpm)

`$ rnpm link`

### In Your AppDelegate (Optional)

If you wish to be able to handle search item tapped callbacks, you'll need to add the following code to your AppDelegate file:

```
#import "RCTSpotlightSearch.h"

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  [RCTSpotlightSearch handleContinueUserActivity:userActivity];
  return YES;
}
```

If Xcode complains about being unable to find the header file, please ensure that your project's header search includes the following:

`$(SRCROOT)/../node_modules/react-native-spotlight-search`

Like this:

![Header Search Paths](http://i.imgur.com/r69EMcQ.png)

# To-do
* Support built in types (location etc).
* Improve image handling.
* Example app demonstrating core functionality.
* Public links.
* Simplify the API.
* Documentation.
* Initial release.
* New iOS 10 features.

PRs welcome ;-)
