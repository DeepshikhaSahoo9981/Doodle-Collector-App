import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import Header from './components/Header';
import Footer from './components/Footer';
import Album from './components/Album';
import { useEffect, useState } from 'react';
import { getAllImagesFromDrive } from './controllers/doodleGenerator';

export const generateDirectLink = (fileId) => {
  return `https://docs.google.com/uc?export=view&id=${fileId}`;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'noodle_soup': require('./assets/fonts/NOODLESOUP.ttf'),
    'digory': require('./assets/fonts/Digory_Doodles_PS.ttf'),
    'poodle': require('./assets/fonts/POODLE.ttf'),
    'special_noodle': require('./assets/fonts/Special_Noodle.otf')
  });

  const [album, setAlbum] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllImages = async () => {
      setIsLoading(false);
      let images = await getAllImagesFromDrive();

      images = images.map(item => {
        return {
          ...item,
          src: { uri: generateDirectLink(item.id) }
        }
      }),
        images.splice(0, 0, {
          name: "default",
          src: require("./assets/iconic/target_856019.png"),
          work: () => {
            return true;
          }
        })

      setIsLoading(true);
      return images;
    }

    setAlbum(getAllImages);

  }, [])

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {album && <Album Images={album} setImages={setAlbum} />}
      <Footer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
