import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { postData } from '../../api/service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_LENGTH = 4;

const OtpVerificationScreen = ({ onDone }) => {
  const navigation = useNavigation();
  const [phonenumber, setPhonenumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  // Ambil nomor hp dari AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('phonenumber').then(value => {
      if (value) setPhonenumber(value);
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleInputChange = (value) => {
    if (/^\d*$/.test(value) && value.length <= OTP_LENGTH) {
      setOtp(value);
      setError('');
    }
  };

  const verifyOtp = async () => {
    const savedPhone = await AsyncStorage.getItem('phonenumber');

    if (!otp.trim() || otp.length !== OTP_LENGTH) {
      setError(`Kode OTP harus ${OTP_LENGTH} digit angka.`);
      return;
    }

    setLoading(true);
    try {
      const formData = { phonenumber: savedPhone, code: otp };
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulasi delay
      const response = await postData('otp/validateWA', formData);
      await AsyncStorage.setItem('accessTokens', response.message.accessToken);
      setLoading(false);
      onDone?.();
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err?.response?.data?.message ||
        'Terjadi kesalahan saat memverifikasi OTP. Coba lagi.';
      setError(errorMessage);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess(false);
    setLoading(true);

    try {
      await postData('otp/sendWA', { phonenumber });
      setTimer(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err?.message || 'Gagal mengirim ulang OTP. Mohon coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Verifikasi OTP</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Feather name="shield" size={64} color="#facc15" style={styles.icon} />

            <Text style={styles.title}>Kode Verifikasi</Text>
            <Text style={styles.subtitle}>
              Masukkan {OTP_LENGTH} digit kode yang kami kirim ke WhatsApp
            </Text>
            <Text style={styles.phone}>{phonenumber}</Text>

            {/* Input OTP */}
            <TextInput
              ref={inputRef}
              autoFocus
              style={[styles.input, error && styles.inputError]}
              placeholder="— — — —"
              keyboardType="numeric"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={handleInputChange}
              editable={!loading}
            />

            {error ? (
              <Text style={styles.errorText}>
                <MaterialIcons name="error-outline" size={16} /> {error}
              </Text>
            ) : null}

            {/* Timer & Resend */}
            <View style={styles.timerContainer}>
              <View style={styles.timerBox}>
                <Ionicons name="time-outline" size={16} color="#555" />
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </View>

              <TouchableOpacity
                onPress={handleResend}
                disabled={timer > 0 || loading}
              >
                <Text
                  style={[
                    styles.resendText,
                    (timer > 0 || loading) && styles.resendDisabled
                  ]}
                >
                  {loading && !resendSuccess ? 'Mengirim ulang...' : 'Kirim Ulang'}
                </Text>
              </TouchableOpacity>
            </View>

            {resendSuccess && (
              <Text style={styles.successText}>OTP berhasil dikirim ulang!</Text>
            )}

            {/* Verify Button */}
            <TouchableOpacity
              onPress={verifyOtp}
              disabled={loading || otp.length !== OTP_LENGTH}
              style={[
                styles.verifyButton,
                (loading || otp.length !== OTP_LENGTH) && styles.buttonDisabled
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.verifyText}>Verifikasi OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.supportText}>
            Masalah?{' '}
            <Text
              style={styles.supportLink}
              onPress={() => Alert.alert('Hubungi Dukungan')}
            >
              Hubungi Dukungan
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
    marginBottom: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginTop: 24,
    elevation: 2,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  phone: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 22,
    letterSpacing: 12,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#555',
  },
  resendText: {
    fontWeight: '600',
    color: '#eab308',
  },
  resendDisabled: {
    color: '#aaa',
  },
  successText: {
    color: 'green',
    marginTop: 12,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#facc15',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  verifyText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },
  buttonDisabled: {
    backgroundColor: '#fde68a',
    opacity: 0.6,
  },
  supportText: {
    fontSize: 12,
    color: '#999',
    marginTop: 24,
  },
  supportLink: {
    color: '#eab308',
    fontWeight: '600',
  },
});
