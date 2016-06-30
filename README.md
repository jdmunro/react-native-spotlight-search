# react-native-spotlight-search
A React Native module for iOS that provides Spotlight search functionality. This allows you to index content from within your React Native app so that it appears in the iOS device's Spotlight search index, potentially increasing the exposure of your app.

Please note this is an early version and the features and API are likely to change.

## Current Features
* Adding items.
* Updating items.
* Deleting items.
* Register a callback to handle when a search item is tapped.
* Limited support for images.

![Spotlight Search Demo](http://i.imgur.com/tbI3yAs.gif)

## Installation

`$ npm install react-native-vector-icons --save`

### iOS 

#### With [`rnpm`](https://github.com/rnpm/rnpm)

`$ rnpm link`

#### In Your AppDelegate (Optional)

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

## Usage

### Indexing Items

You can either add an array of items:

```
SpotlightSearch.indexItems([
    {
        title: 'Strawberry',
        contentDescription: 'A sweet and juicy fruit.',
        uniqueIdentifier: '1',
        thumbnailUri: require('image!strawberry').path,
    },
    {
        title: 'Strawberry',
        contentDescription: 'Not a type of bird.',
        uniqueIdentifier: '2',
        thumbnailUri: require('kiwi!strawberry').path,
    },
]);
```

Or individual items:

```
SpotlightSearch.indexItem({
    title: 'Strawberry',
    contentDescription: 'A sweet and juicy fruit.',
    uniqueIdentifier: '1',
    thumbnailUri: require('image!strawberry').path,
});
```

#### Search Item Properties

| Property | Description | Type | Required |
|---|----|---|---|
|**`title`**|The title of the search item.|`string`|Yes|
|**`contentDescription`**|A description which appears below the title in the search results.|`string`|No|
|**`uniqueIdentifier`**|A unique and stable identifier. Used to refer to the item. |`string`|Yes|
|**`thumbnailUri`**|A local file URI to a thumbnail image.|`string`|No|

### Updating Items

Simply use the same method as adding items. Be sure to reference the same key when indexing the item so that any new metadata changes will be reflected in the Spotlight index.

### Removing Items

Items can be removed by identifier:

```
SpotlightSearch.deleteItemsWithIdentifiers(["1", "2"]);
```

Or by domain:

```
SpotlightSearch.deleteItemsInDomains(["fruit"]);
```

Alternatively, you can delete _all_ items indexed by your app:

```
SpotlightSearch.deleteAllItems(["fruit"]);
```

### Handling User Interactions

Optionally, you can choose to add a custom handler that will be invoked in the event of a user tapping one of the search items in the Spotlight results:

```
SpotlightSearch.searchItemTapped((uniqueIdentifier) => {
  alert(`You tapped on ${uniqueIdentifier}!`);
});
```

The parameter will be the ```uniqueIdentifier``` that the item was indexed with. You can use this to lookup the item and display information about it, e.g. by navigating to a relevant page in your app.

## To-do
* Support built in types (location etc).
* Improve image handling.
* Example app demonstrating core functionality.
* Public links.
* Simplify the API.
* Documentation.
* Initial release.
* New iOS 10 features.

PRs welcome ;-)
