import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ImageProps } from '../services/storage';

interface PhotoCardProps {
  item: ImageProps;
}

const PhotoCard: FC<PhotoCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'file://' + item.localPath }}
        style={styles.image}
      />
      <Text>{item.caption}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
};

export default PhotoCard;

const styles = StyleSheet.create({
  card: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
});
