import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Home, 
  LifeBuoy, 
  Shield, 
  Info, 
  ChevronRight, 
  LogOut, 
  User, 
  Trash2
} from 'lucide-react-native'; // ✅ tambah ikon hapus
import { getData, deleteData } from '../../api/service';

const AkunPage = ({ navigation, onDone }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying session:", error);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('accessTokens');
      onDone(); 
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Keluar', onPress: signOut }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Apakah Anda yakin ingin menghapus akun Anda?',
      'Akun dan data pribadi Anda akan dihapus secara permanen. Riwayat transaksi tetap tersimpan untuk keperluan hukum, namun tidak lagi terhubung dengan identitas Anda. Apakah Anda yakin ingin melanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteData('auth/deleteAccount'); // ✅ API hapus akun
              await AsyncStorage.removeItem('accessTokens');
              onDone(); // arahkan kembali ke login / landing
            } catch (error) {
              console.error("Error saat hapus akun:", error);
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus akun. Coba lagi.');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    { label: 'Pertanyaan Umum', icon: Home, path: 'FaqScreen' },
    { label: 'Keamanan Akun', icon: Shield, path: 'SecurityScreen' },
    { label: 'Tentang Aplikasi', icon: Info, path: 'AboutScreen' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <View style={{ padding: 16, borderColor: '#eee' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Akun Saya</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* PROFILE */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 16,
            backgroundColor: '#fff',
            elevation: 3,
            marginBottom: 16
          }}>
            {userData.image ? (
              <Image 
                source={{ uri: userData.image }}
                style={{ width: 80, height: 80, borderRadius: 40, marginRight: 16 }}
              />
            ) : (
              <User size={64} color="#9ca3af" style={{ marginRight: 16 }} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111' }}>
                {userData.fullName === '' || !userData.fullName ? 'Pengguna Beres' : userData.fullName}
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                {userData.phone || 'Nomor telepon tidak tersedia'}
              </Text>
              <Text style={{ fontSize: 12, color: '#777', marginTop: 2 }}>
                {userData.email || 'Email tidak tersedia'}
              </Text>
            </View>
          </View>

          {/* MENU */}
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            elevation: 3,
            marginBottom: 16
          }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(item.path)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderBottomWidth: index !== menuItems.length - 1 ? 1 : 0,
                  borderColor: '#f1f1f1'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <item.icon size={24} color="#9333ea" style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 16, color: '#111' }}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 12
            }}
          >
            <LogOut size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Keluar Akun</Text>
          </TouchableOpacity>

          {/* DELETE ACCOUNT */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              backgroundColor: '#6b7280', // abu-abu gelap
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <Trash2 size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Hapus Akun</Text>
          </TouchableOpacity>

          {/* VERSION */}
          <Text style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
            Versi Aplikasi v1.0.0
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AkunPage;
