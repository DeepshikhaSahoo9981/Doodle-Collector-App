import { StyleSheet, Text, View, ActivityIndicator, Image, TextInput, Alert, Pressable } from 'react-native';
export default function Preview({ imageDetail, setCloseWindow }) {

    const handleCloseWindow = () => {
        setCloseWindow(null);
    }

    return (
        <View style={styles.previewWindow}>
            <Image source={imageDetail.src} style={styles.imagePreview} />
            <View style={styles.textPreview}>
                <Text style={styles.textPreview}>{imageDetail.name}</Text>
            </View>
            <Pressable onPress={handleCloseWindow}>
                <Image source={require("../assets/iconic/get-out_9307106.png")} style={styles.closeIcon} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    previewWindow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "auto",
        flexDirection: "column",
        gap: 10,
        backgroundColor: "none"
    },
    imagePreview: {
        width: 240,
        height: 240,
        margin: 20
    },
    textPreviewBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        borderWidth: 1,
        borderColor: "#777",
        borderStyle: "dashed"
    },
    textPreview: {
        fontFamily: "poodle",
        fontSize: 24,
        color: "#000",
        textAlign: "center"
    },
    closeIcon: {
        width: 50,
        height: 50,
        margin: 10
    }
});