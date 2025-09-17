import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Image, Alert, Modal, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { postData } from '../../api/service';
import logo from '../../assets/logo.png';
import terms from '../../data/syaratketentuan.json';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // state baru untuk modal & agreement
  const [modalVisible, setModalVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  const sendOtp = async () => {
    setError('');
    if (!phoneNumber.trim()) {
      setError("Nomor ponsel tidak boleh kosong.");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (formattedPhone.length < 10 || !formattedPhone.startsWith('+62')) {
      setError("Format nomor ponsel tidak valid. Gunakan format 08xx atau +628xx.");
      return;
    }

    if (!agreed) {
      Alert.alert("Peringatan", "Anda harus menyetujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    const formData = { phonenumber: formattedPhone };

    setLoading(true);
    try {
      await postData('otp/sendWA', formData);
      await AsyncStorage.setItem('phonenumber', formattedPhone);
      navigation.navigate('OtpScreen');
    } catch (err) {
      console.error("API Error:", err);
      Alert.alert("Gagal", "Gagal mengirim OTP. Mohon coba lagi atau hubungi dukungan.");
      setError("Gagal mengirim OTP. Mohon coba lagi atau hubungi dukungan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.heading}>Masuk ke Akun Anda</Text>
        <Text style={styles.subheading}>
          Verifikasi nomor ponsel Anda untuk melanjutkan.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nomor Ponsel</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Cth. 081234567890"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            returnKeyType="done"
            editable={!loading}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Checkbox S&K */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, agreed && styles.checkboxChecked]}
            onPress={() => setModalVisible(true)}   // ✅ buka modal dari checkbox
          >
            {agreed && <Text style={styles.checkboxTick}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Saya menyetujui{" "}
            <Text style={styles.termsLink} onPress={() => setModalVisible(true)}>
              Syarat & Ketentuan
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={sendOtp}
          disabled={loading || !agreed}
          style={[
            styles.button,
            (loading || !agreed) && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#1a202c" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Mengirim...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal Syarat & Ketentuan */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // ✅ Android back button
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalHeading}>{terms.title}</Text>
            {terms.content.map((item, index) => (
              <Text key={index} style={styles.modalText}>
                {index + 1}. {item}{"\n\n"}
              </Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setAgreed(true);        // ✅ centang otomatis
              setModalVisible(false); // ✅ tutup modal
            }}
          >
            <Text style={styles.modalButtonText}>Saya Mengerti</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 112, height: 112 },
  heading: { fontSize: 28, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  subheading: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 32 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 16, color: '#1f2937', backgroundColor: '#fff' },
  inputError: { borderColor: '#ef4444' },
  errorText: { marginTop: 8, fontSize: 14, color: '#dc2626' },

  // checkbox
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#d1d5db', borderRadius: 6, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#fcd34d', borderColor: '#fcd34d' },
  checkboxTick: { color: '#1a202c', fontSize: 14, fontWeight: 'bold' },
  checkboxText: { fontSize: 14, color: '#374151' },

  button: { width: '100%', paddingVertical: 12, borderRadius: 12, backgroundColor: '#fcd34d', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#1a202c', fontWeight: 'bold', fontSize: 16 },

  // modal
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20, marginVertical: 40 },
  modalContent: { flex: 1 },
  modalHeading: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#1f2937' },
  modalText: { fontSize: 16, color: '#374151', lineHeight: 24 },
  modalButton: { backgroundColor: '#fcd34d', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  modalButtonText: { fontSize: 16, fontWeight: '700', color: '#1a202c' },
});

export default LoginScreen;
