// screens/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Button,
    Animated,
    useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingItem from './components/OnboardingItem';
import Paginator from './components/Paginator';
import data from './data/onboardingData';

const OnboardingScreen = ({ navigation, onDone }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const colorScheme = useColorScheme();

    const handleDone = async () => {
        await AsyncStorage.setItem('seenOnboar', 'true');
        if (typeof onDone === 'function') {
            onDone(); // ← ini akan trigger checkOnboarding dari RootNavigator
        }
    };

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
            <View style={styles.topContainer}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.buttonContainer2}>
                <Paginator data={data} currentIndex={currentIndex} />
            </View>

            {currentIndex === data.length - 1 && (
                <View style={styles.buttonContainer}>
                    <Button title="Mulai" onPress={handleDone} />
                </View>
            )}
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
    },
    buttonContainer2: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
});
