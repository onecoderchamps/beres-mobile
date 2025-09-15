// components/OnboardingCarouselItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingCarouselItem = ({ item }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.slide, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>{item.title}</Text>
      <Text style={[styles.description, { color: isDark ? '#ccc' : '#666' }]}>{item.description}</Text>
    </View>
  );
};

export default OnboardingCarouselItem;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: width,  // full width
  },
  image: {
    width: width * 0.6,
    height: height * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
