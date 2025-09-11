import React, { FC, useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput, View } from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import PhotoCard from '../components/PhotoCard';
import { ImageProps, loadDB } from '../services/storage';
import { startSyncListener, trySync } from '../services/sync';

const HomeScreen: FC = () => {
  const [imageList, setImageList] = useState<ImageProps[]>([]);
  const [caption, setCaption] = useState<string>('');

  useEffect(() => {
    startSyncListener();
    refresh();
  }, []);

  // Create function for refresh list data
  const refresh = async () => {
    const res = await loadDB();
    setImageList(res);
  };

  // Create function for handle image
  const pickImage = async (fromCamera: boolean) => {
    const opts = { mediaType: 'photo', quality: 0.8 };
    const res = fromCamera
      ? await launchCamera(opts)
      : await launchImageLibrary(opts);

    if (res.didCancel || !res.assets || res.assets.length === 0) return;

    const asset: Asset = res.assets[0];
    if (!asset.uri) return;

    setCaption('');
    await refresh();
    trySync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Caption"
          value={caption}
          onChangeText={setCaption}
          style={styles.inputBox}
        />
        <Button title="Camera" onPress={() => pickImage(true)} />
        <Button title="Gallery" onPress={() => pickImage(false)} />
      </View>

      <FlatList
        data={imageList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PhotoCard item={item} />}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
  },
});
