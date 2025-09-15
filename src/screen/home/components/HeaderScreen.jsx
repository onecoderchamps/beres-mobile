import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getData } from '../../../api/service';
import Icon from 'react-native-vector-icons/FontAwesome'; // User icon
import { useNavigation } from '@react-navigation/native';

const WelcomeHeader = () => {
  const navigation = useNavigation();
  const hasNotifications = false; // nanti bisa ganti dengan logika asli
  const [data, setData] = useState({});

  const getDatabase = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setData(response.data);
    } catch (error) {
      alert(error || 'Terjadi kesalahan saat memverifikasi.');
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.subTitle}>Selamat Datang</Text>
        <Text style={styles.title}>Hai, {data.fullName}</Text>
      </View>

      {/* <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate('AkunPage')}
      >
        <Icon name="user-circle" size={28} color="#374151" />

        {hasNotifications && (
          <View style={styles.badgeContainer}>
            <View style={styles.badgePing} />
            <View style={styles.badgeDot} />
          </View>
        )}
      </TouchableOpacity> */}
    </View>
  );
};

export default WelcomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  textContainer: {
    flex: 1,
  },
  subTitle: {
    fontSize: 12,
    color: '#4B5563', // gray-600
    marginBottom: 2,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827', // gray-900
  },
  iconWrapper: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F87171', // red-400
    opacity: 0.75,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444', // red-500
  },
});
