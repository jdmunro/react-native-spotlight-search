import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SpotlightSearch from 'react-native-spotlight-search';

const sampleFruits = [
  {
    name: 'Strawberry',
    details: 'A sweet and juicy fruit.',
    key: '1',
    image: require('image!strawberry'),
  },
  {
    name: 'Banana',
    details: 'A bright yellow fruit.',
    key: '2',
    image: require('image!banana'),
  },
]

SpotlightSearch.searchItemTapped((uniqueIdentifier) => {
  const selectedFruit = sampleFruits.filter((fruit) => fruit.key === uniqueIdentifier)[0];

  alert(`You tapped on ${selectedFruit.name}!`);
});

const indexSearchableItems = (() => {
  SpotlightSearch.indexItems(sampleFruits.map((fruit) => {
    return {
      domain: 'fruit',
      item: {
        title: fruit.name,
        contentDescription: fruit.details,
        uniqueIdentifier: fruit.key,
        thumbnailUri: fruit.image.path,
      },
    };
  }));
})();

class example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('example', () => example);
