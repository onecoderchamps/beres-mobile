// screen/akun/AboutAppScreen.js
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Info } from 'lucide-react-native';

const AboutAppScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>

      {/* Logo Aplikasi */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Image
          source={require('../../assets/logo.png')} // ganti sesuai logo aplikasi kamu
          style={{ width: 100, height: 100, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111' }}>
          BERES
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>Versi 1.0.0</Text>
      </View>

      {/* Deskripsi */}
      <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22, textAlign: 'center', marginBottom: 20 }}>
        Aplikasi ini dibuat untuk membantu pengguna dalam mengelola aset,
        edukasi finansial, serta memudahkan akses layanan dalam satu genggaman.
        Dengan desain sederhana dan fitur lengkap, kami ingin memberikan
        pengalaman terbaik untuk Anda.
      </Text>

      {/* Informasi Developer */}
      <View style={{ padding: 16, backgroundColor: '#f9fafb', borderRadius: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 6 }}>
          Developer
        </Text>
        <Text style={{ fontSize: 14, color: '#374151' }}>PT Patungan Properti International</Text>
        <Text style={{ fontSize: 14, color: '#374151' }}>Email: support@beres.co.id</Text>
      </View>

      {/* Copyright */}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#9ca3af',
          marginTop: 24,
        }}
      >
        © 2025 Nama Aplikasi. Semua Hak Dilindungi.
      </Text>
    </ScrollView>
  );
};

export default AboutAppScreen;
