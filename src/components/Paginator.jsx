// components/Paginator.js
import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';

const Paginator = ({ data, currentIndex }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      {data.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === currentIndex
                  ? isDark ? '#fff' : '#000'
                  : isDark ? '#666' : '#ccc',
              width: i === currentIndex ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});
