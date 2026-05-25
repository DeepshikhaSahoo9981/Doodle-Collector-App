import { StyleSheet, Text, View, ActivityIndicator, Image, Dimensions, FlatList, Pressable } from 'react-native';
import UploadWindow from './UploadWindow';
import { useEffect, useState } from 'react';
import Preview from './Preview';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = (width - 45) / 2;

// const IMAGES = [{
//     name: "image 1",
//     src: require("../assets/album/image1.jpeg")
// },
// {
//     name: "image 2",
//     src: require("../assets/album/image2.jpeg")
// },
// {
//     name: "image 3",
//     src: require("../assets/album/image3.jpeg")
// },
// {
//     name: "image 4",
//     src: require("../assets/album/image4.jpeg")
// },
// {
//     name: "default",
//     src: require("../assets/iconic/target_856019.png"),
//     work: () => {
//         return true;
//     }
// }]
export default function Album({ Images, setImages }) {
    const [uploadWindow, setUploadWindow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageLoaded, setImagedLoaded] = useState(false);

    // useEffect(() => { console.log(Images) },[]);
    const renderItem = ({ item }) => {
        // console.log(Images)
        if (!item.work)
            return <Pressable onPress={() => setSelectedImage(item)}>
                <Image source={item.src} style={styles.picture_of_album} />
            </Pressable>
        else {
            return <Pressable onPress={() => { setUploadWindow(true) }}>
                <Image source={item.src} style={styles.picture_of_album} />
            </Pressable>
        }
    };
    return (
        <View style={styles.album}>
            {!uploadWindow && !selectedImage && <FlatList
                data={Images._j|| Images}
                renderItem={renderItem}
                keyExtractor={(item) => item.name || item.id}
                numColumns={2}
                columnWrapperStyle={styles.rowWrapper}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={true} // Displays a native scroll track indicator on swipe
                bounces={true}                      // Adds the premium iOS elastic bounce effect on top/bottom pull
            />}
            {
                uploadWindow && <UploadWindow setUploadWindow={setUploadWindow} setImages={setImages} />
            }
            {
                selectedImage && <Preview imageDetail={selectedImage} setCloseWindow={setSelectedImage} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    album: {
        flex: 1,
        backgroundColor: 'none',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 135 + 196,
        position: "relative",

    },
    addButton: {
        width: 100,
        height: 100
    },
    picture_of_album: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderRadius: 24,
        // borderWidth: 0.5,           // Thickness of the line
        // borderColor: '#000000',       // Line color
        // borderStyle: 'solid',     // Options: 'solid', 'dashed', or 'dotted',
    },
    gridContainer: {
        paddingHorizontal: 15,
        paddingTop: 40,          // Safe top padding space for phone cameras/notches
        paddingBottom: 40,       // Safe bottom padding so the last row is fully viewable on swipe up
    },
    rowWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10
    },
});

