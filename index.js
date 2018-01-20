import {NativeModules, NativeEventEmitter} from 'react-native';

const {SpotlightSearch} = NativeModules;

const spotlightEventEmitter = new NativeEventEmitter(SpotlightSearch);

SpotlightSearch.searchItemTapped = (callback) => spotlightEventEmitter.addListener('spotlightSearchItemTapped', callback);

export default SpotlightSearch;
