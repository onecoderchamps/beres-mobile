import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData } from '../../api/service';
import logo from '../../assets/logo.png'; 

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const formData = {
      phonenumber: formattedPhone
    };

    setLoading(true);
    try {
      // Menggunakan Async Storage sebagai pengganti localStorage
      await postData('otp/sendWA', formData);
      await AsyncStorage.setItem('phonenumber', formattedPhone);
      navigation.navigate('OtpScreen');
    } catch (err) {
      console.error("API Error:", err);
      // Menggunakan Alert untuk menampilkan pesan kesalahan yang lebih jelas
      Alert.alert("Gagal", "Gagal mengirim OTP. Mohon coba lagi atau hubungi dukungan.");
      setError("Gagal mengirim OTP. Mohon coba lagi atau hubungi dukungan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.heading}>
          Masuk ke Akun Anda
        </Text>
        <Text style={styles.subheading}>
          Verifikasi nomor ponsel Anda untuk melanjutkan.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Nomor Ponsel
          </Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Cth. 081234567890"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            returnKeyType="done"          // ✅ tombol selesai
            editable={!loading}
          />
          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={sendOtp}
          disabled={loading}
          style={[styles.button, loading && styles.buttonLoading]}
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

        <Text style={styles.termsText}>
          Dengan masuk, Anda menyetujui <Text style={styles.termsLink}>Syarat & Ketentuan</Text> kami.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Mengganti gradien dengan warna solid
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 112,
    height: 112,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#dc2626',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fcd34d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoading: {
    backgroundColor: '#fcd34d',
    opacity: 0.75,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a202c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 24,
  },
  termsLink: {
    color: '#d97706',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
