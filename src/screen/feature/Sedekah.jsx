// screens/sedekah/SedekahScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { getData, postData } from '../../api/service';
import BackButton from '../../components/BackButton';
import { useNavigation } from '@react-navigation/native';

const SedekahScreen = () => {
  const [loading, setLoading] = useState(true);
  const [totalSedekah, setTotalSedekah] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [history, setHistory] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    setLoading(true);
    try {
      const transaksi = await getData('Sedekah');
      setHistory(
        transaksi.data.filter(item => item.type.includes('Sedekah'))
      );
      setTotalSedekah(transaksi.totalSedekah);
    } catch (error) {
      console.error('Error fetching sedekah data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Terjadi kesalahan saat memuat data sedekah.'
      );
      setHistory([]);
      setTotalSedekah(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    const amount = parseInt(nominal.replace(/\D/g, ''));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Nominal harus diisi dengan angka lebih dari 0.');
      return;
    }
    if (!keterangan.trim()) {
      Alert.alert('Error', 'Keterangan tidak boleh kosong.');
      return;
    }

    try {
      await postData('Transaksi/Sedekah', {
        nominal: amount,
        keterangan: keterangan.trim(),
      });
      await getDatabase();
      setModalVisible(false);
      setNominal('');
      setKeterangan('');
      Alert.alert('Berhasil', 'Sedekah Anda berhasil dicatat. Terima kasih!');
    } catch (err) {
      console.error('Sedekah transaction failed:', err);
      Alert.alert(
        'Gagal',
        err?.response?.data?.message || err?.message || 'Transaksi sedekah gagal.'
      );
    }
  };

  const formatCurrency = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '';
    return number.toLocaleString('id-ID');
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Total Sedekah */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Sedekah Terkumpul</Text>
            <Text style={styles.totalAmount}>
              Rp {formatCurrency(totalSedekah)}
            </Text>
            <Text style={styles.totalDesc}>Mari terus berlomba dalam kebaikan.</Text>
          </View>

          {/* Sedekah Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Sedekah Sekarang</Text>
          </TouchableOpacity>

          {/* Riwayat Sedekah (Optional, bisa ditambahkan) */}
          {/* {history.map(item => (
            <View key={item.id}>
              <Text>{item.ket}</Text>
              <Text>{item.nominal}</Text>
            </View>
          ))} */}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Form Sedekah</Text>
            <TextInput
              style={styles.input}
              placeholder="Nominal (contoh: 100000)"
              value={nominal}
              onChangeText={(text) => setNominal(text.replace(/\D/g, ''))}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Keterangan (contoh: Untuk anak yatim)"
              value={keterangan}
              onChangeText={setKeterangan}
              multiline={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleTransfer}
              >
                <Text style={styles.submitText}>Sedekah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SedekahScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  totalCard: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalLabel: { color: 'white', fontSize: 16, marginBottom: 8 },
  totalAmount: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  totalDesc: { color: 'white', fontSize: 12, marginTop: 4 },

  button: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  modalButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginLeft: 8 },
  cancelButton: { backgroundColor: '#E5E7EB' },
  cancelText: { color: '#374151', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#10B981' },
  submitText: { color: 'white', fontWeight: 'bold' },
});
