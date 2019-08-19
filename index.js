import {NativeModules, NativeEventEmitter, Platform} from 'react-native';

const {SpotlightSearch} = NativeModules;
const spotlightEventEmitter = new NativeEventEmitter(SpotlightSearch);

const EVENT_ITEM_TAPPED = 'spotlightSearchItemTapped';
const nullFunc = () => {};

export default {
    getInitialSearchItem: Platform.select({
        ios: SpotlightSearch?.getInitialSearchItem,
        android: nullFunc
    }),
    indexItem: Platform.select({
        ios: (item) => SpotlightSearch?.indexItem(item),
        android: nullFunc
    }),
    indexItems: Platform.select({
        ios: (items) => SpotlightSearch?.indexItems(items),
        android: nullFunc
    }),
    deleteItemsWithIds: Platform.select({
        ios: (ids) => SpotlightSearch?.deleteItemsWithIdentifiers(ids),
        android: nullFunc
    }),
    deleteItemsInDomains: Platform.select({
        ios: (domains) => SpotlightSearch?.deleteItemsInDomains(domains),
        android: nullFunc
    }),
    deleteAllItems: Platform.select({
       ios: SpotlightSearch?.deleteAllItems,
       android:  nullFunc
    }),
    searchItemTapped: Platform.select({
        ios: (callback) => spotlightEventEmitter?.addListener(EVENT_ITEM_TAPPED, callback),
        android: nullFunc
    }),
}
