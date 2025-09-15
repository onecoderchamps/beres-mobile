// screen/akun/SecurityScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

const SecurityScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>

      {/* Deskripsi Keamanan */}
      <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 16 }}>
        Aplikasi ini mengutamakan keamanan akun pengguna. Untuk memastikan
        data Anda tetap terlindungi, kami hanya menggunakan verifikasi melalui
        nomor ponsel.
      </Text>

      {/* OTP */}
      <View style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 6 }}>
          Verifikasi OTP
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>
          Setiap kali Anda login, aplikasi akan mengirimkan kode OTP (One Time Password) 
          ke nomor ponsel yang terdaftar. Kode ini hanya berlaku satu kali dan 
          bersifat rahasia.
        </Text>
      </View>

      {/* Tips Keamanan */}
      <View style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 6 }}>
          Tips Keamanan
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>
          • Jangan pernah membagikan kode OTP kepada siapa pun.
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>
          • Pastikan nomor ponsel Anda selalu aktif.
        </Text>
        <Text style={{ fontSize: 14, color: '#374151' }}>
          • Hubungi support jika menemukan aktivitas mencurigakan pada akun Anda.
        </Text>
      </View>

      {/* Catatan */}
      <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 12 }}>
        Kami tidak pernah meminta password atau kode OTP melalui telepon maupun pesan pribadi.
      </Text>
    </ScrollView>
  );
};

export default SecurityScreen;
