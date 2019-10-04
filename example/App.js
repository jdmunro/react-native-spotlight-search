import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';
import SpotlightSearch from 'react-native-spotlight-search';

const sampleFruits = [
  {
    name: 'Strawberry',
    details: 'A sweet and juicy fruit.',
    key: '1',
    image: 'strawberry',
    keywords: ['delicious', 'edible'],
  },
  {
    name: 'Banana',
    details: 'A bright yellow fruit.',
    key: '2',
    image: 'banana',
    keywords: ['plantain'],
  },
  {
    name: 'Kiwi',
    details: 'Not a type of bird.',
    key: '3',
    image: 'kiwi',
    keywords: ['new zeland'],
  },
];

SpotlightSearch.searchItemTapped((uniqueIdentifier) => {
  const selectedFruit = sampleFruits.filter((fruit) => fruit.key === uniqueIdentifier)[0];

  alert(`You tapped on ${selectedFruit.name}!`);
});

SpotlightSearch.indexItems(sampleFruits.map((fruit) => {
  return {
    title: fruit.name,
    contentDescription: fruit.details,
    uniqueIdentifier: fruit.key,
    thumbnailName: fruit.image,
    keywords: fruit.keywords,
  };
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingLeft: 10,
    paddingRight: 10,
  },
  introText: {
    marginTop: 64,
  },
  row: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTextContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 4,
  },
  rowTitle: {
    fontSize: 20,
  },
  rowDescription: {
    color: '#333333',
  },
  rowImage: {
    width: 64,
    height: 64,
  }
});

const FruitRow = ({fruit}) => (
  <View style={styles.row}>
    <Image resizeMode={"contain"}
      style={styles.rowImage}
      source={{uri: fruit.image}}/>
    <View style={styles.rowTextContainer}>
      <Text style={styles.rowTitle}>{fruit.name}</Text>
      <Text style={styles.rowDescription}>{fruit.details}</Text>
    </View>
  </View>
);

const Example = () => (
  <View style={styles.container}>
    <Text style={styles.introText}>The items below have been added to the Spotlight search index on this device.</Text>
    {sampleFruits.map((fruit) => (
      <FruitRow
        key={fruit.key}
        fruit={fruit}
      />
    ))}
    <Button title={'Delete all items from the suggestion list'} onPress={SpotlightSearch.deleteAllItems} />
  </View>
);

export default Example;
