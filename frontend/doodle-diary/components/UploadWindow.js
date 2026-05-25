import { StyleSheet, Text, View, ActivityIndicator, Image, TextInput, Alert, Pressable } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getAllImagesFromDrive, uploadImageToDriveThroughApi } from '../controllers/doodleGenerator';
import { generateDirectLink } from '../App';


export default function UploadWindow({ setUploadWindow, setImages }) {
    const [fileName, setFileName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMime, setSelectedMime] = useState("image/jpeg");
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to upload files!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setSelectedImage(imageUri);
            setSelectedMime(result.assets[0].mimeType);

            const localFileName = imageUri.split('/').pop().split(".")[0];
            setFileName(localFileName || 'New Image Entry');
        }

    }

    const uploadImage = async () => {

        if (isUploading) return;
        if (!selectedImage) {
            Alert.alert("No Image Uploaded");
            return;
        }

        setIsUploading(true);

        await uploadImageToDriveThroughApi(selectedImage, fileName, selectedMime)

        let images = await getAllImagesFromDrive();

        let formattedImages = images.map(item => {
            return {
                ...item,
                src: { uri: generateDirectLink(item.id) }
            }
        })
        formattedImages.splice(0, 0, {
            name: "default",
            src: require("../assets/iconic/target_856019.png"),
            work: () => {
                return true;
            }
        })

        // console.log(formattedImages)
        setImages(formattedImages);
        setUploadWindow(false)
    }

    const exitPage = () => {
        setUploadWindow(false)
    }

    return (
        <View
            style={styles.floating_window}
        >
            <Pressable onPress={pickImage}>
                <View style={styles.dropZone}>
                    {selectedImage ? <Image
                        source={{ uri: selectedImage }}
                        style={styles.imagePreview}
                    /> : <Image
                        source={require("../assets/iconic/upload_13453952.png")}
                        style={styles.uploadIcon}
                    />}
                </View>
            </Pressable>
            <View style={styles.textBox}>
                <TextInput
                    style={styles.inputText}
                    placeholder="File Name"
                    placeholderTextColor="#777"
                    value={fileName}
                    onChangeText={setFileName}
                />
            </View>

            <Pressable onPress={uploadImage}>
                <View style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Upload</Text>
                </View>
            </Pressable>
            <Pressable onPress={exitPage}>
                <Image
                    source={require("../assets/iconic/end_9307138.png")}
                    style={styles.exitIcon}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    floating_window: {
        display: 'flex',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    dropZone: {
        width: '100%',
        height: "auto",        // Scales dynamically to a crisp responsive square size
        borderWidth: 2,
        borderColor: '#000000',
        borderStyle: 'dashed',      // Creates the perfect uniform dashed block trace lines
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: 240,
        height: 240,
        resizeMode: 'cover'
    },
    uploadIcon: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        margin: 60,
    },
    confirmButton: {
        display: 'flex',
        backgroundColor: '#F84040',
        alignItems: 'center',
        justifyContent: 'center',
        height: "auto",
        width: 240,
        padding: 10,
        borderRadius: 0

    },
    textBox: {
        display: 'flex',
        backgroundColor: 'none',
        // alignItems: 'center',
        justifyContent: 'center',
        height: "auto",
        width: 240,
        padding: 10,
        borderRadius: 0,
        borderWidth: 0.5,
        borderColor: "black",
        borderStyle: "dotted"
    },
    inputText: {
        fontFamily: "poodle",
        color: "black",
        fontSize: 18
    },
    confirmText: {
        fontFamily: "noodle_soup",
        color: "white",
        fontSize: 24
    },
    exitIcon: {
        width: 50,
        height: 50
    }
});