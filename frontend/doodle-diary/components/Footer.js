import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { generate } from "../controllers/doodleGenerator";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Footer({ }) {
    const [selected, setSelected] = useState(false);
    const [page, setPage] = useState(0);
    const [lists, setDoodleTopics] = useState(null);
    const [needNewTopics, setNeedNewTopics] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Prevents duplicate API spam

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    const handleRegenerate = async () => {
        if (isLoading) return;
        
        try {
            const today = getTodayDateString();

            const storedDate = await AsyncStorage.getItem('@generation_date');
            const storedCountStr = await AsyncStorage.getItem('@generation_count');
            let currentCount = storedCountStr ? parseInt(storedCountStr, 10) : 0;

            if (storedDate && storedDate === today) {
                if (currentCount >= 5) {
                    Alert.alert(
                        "Daily Limit Reached",
                        "You can only generate 2 doodle topics per day! Come back tomorrow for new ideas."
                    );
                    setSelected(true);
                    setPage(0);
                    return;
                }
            } else {
                currentCount = 0;
            }

            setSelected(true);
            setPage(0);
            setNeedNewTopics(true);

            const newCount = currentCount + 1;
            await AsyncStorage.setItem('@generation_date', today);
            await AsyncStorage.setItem('@generation_count', newCount.toString());

        } catch (error) {
            console.error("Failed to process rate limit checking:", error);
            setSelected(true);
            setPage(0);
        }
    };

    const handleSelect = () => {
        setSelected(true);
        setPage(0);
        // If they don't have topics loaded yet, flag it to fetch
        if (!lists) {
            setNeedNewTopics(true);
        }
    };

    useEffect(() => {
        const getList = async () => {
            setIsLoading(true);
            const result = await generate();

            if (result && result.message && result.message.doodle_topics) {
                const cleanTopicsArray = result.message.doodle_topics;
                setDoodleTopics(cleanTopicsArray);
            } else {
                // Fallback indicator so it doesn't loop infinitely if result is completely empty
                setDoodleTopics([]); 
            }
            setIsLoading(false);
        };

        if (needNewTopics) {
            setNeedNewTopics(false); // Turn off the flag immediately
            getList();
        }
    }, [needNewTopics]);

    const handlePageChange = () => {
        if (lists) setPage(prev => Math.min(prev + 1, lists.length - 1));
    };

    const handlePageChange_Rev = () => {
        setPage(prev => Math.max(prev - 1, 0));
    };

    const reset = () => {
        setSelected(false);
        setPage(0);
        return true; 
    };
    console.log(lists)
    useEffect(() => {
        const slideBackTheGenerator = BackHandler.addEventListener("hardwareBackPress", reset);
        return () => slideBackTheGenerator.remove();
    }, []);

    return (
        // Fixed container structuring layout logic bounds
        <View style={[styles.footer_main, selected ? styles.footer_expanded : styles.footer_collapsed]}>
            
            {/* Action Row containing layout text panels & navigation paths */}
            <View style={styles.actionRow}>
                <Pressable onPress={handlePageChange_Rev}>
                    {selected && (
                        <Image
                            source={require("../assets/images/nextarrow.png")}
                            style={styles.nextIcon_l}
                        />
                    )}
                </Pressable>

                {!selected ? (
                    <Pressable onPress={handleSelect}>
                        <Image
                            source={require("../assets/images/magic_icon.png")}
                            style={styles.magicIcon}
                        />
                    </Pressable>
                ) : isLoading? <Text style={styles.listText}>Generating Image</Text> : (
                    <View style={styles.textBox}>
                        <Text style={styles.listText}>
                            {lists && lists[page] ? lists[page] : "Generating your topics..."}
                        </Text>
                    </View>
                )}

                {selected && (
                    <Pressable onPress={handlePageChange}>
                        <Image
                            source={require("../assets/images/nextarrow.png")}
                            style={styles.nextIcon_r}
                        />
                    </Pressable>
                )}
            </View>

            {/* 🌟 Control Buttons placed inside the main block instead of behind it */}
            {selected && (
                <View style={styles.controlContainer}>
                    <Pressable onPress={reset}>
                        <Image
                            source={require("../assets/iconic/get-out_9307106.png")}
                            style={styles.closeIcon}
                        />
                    </Pressable>
                    <Pressable onPress={handleRegenerate}>
                        <Image 
                            source={require("../assets/iconic/design_9160781.png")} 
                            style={styles.regenerateIcon} 
                        />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Main Wrapper handles background and absolute constraints cleanly
    footer_main: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: "#F84040",
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footer_collapsed: {
        height: 100,
        justifyContent: 'center',
    },
    footer_expanded: {
        height: 400,
        justifyContent: 'space-between',
        paddingVertical: 30,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    controlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 10,
    },
    magicIcon: {
        width: 50,
        height: 50,
        alignSelf: 'center',
    },
    nextIcon_r: {
        width: 40,
        height: 40,
    },
    nextIcon_l: {
        width: 40,
        height: 40,
        transform: [{ rotate: '180deg' }], // Fixed cross-platform transform layout syntax array object
    },
    closeIcon: {
        width: 65,
        height: 65,
    },
    regenerateIcon: {
        width: 65,
        height: 65,
    },
    textBox: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listText: {
        fontFamily: "special_noodle",
        color: "white",
        fontSize: 22,
        textAlign: 'center',
    },
});