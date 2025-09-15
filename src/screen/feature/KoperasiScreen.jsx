// screens/koperasi/KoperasiScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { getData, postData } from '../../api/service';
import { useNavigation } from '@react-navigation/native';

const KoperasiScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(300000);
  const [modalVisible, setModalVisible] = useState(false);
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [history, setHistory] = useState([]);
  const [rekening, setRekening] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      const rekeningRes = await getData('rekening/SettingIuranBulanan');
      const transaksi = await getData('transaksi');
      setHistory(transaksi.data.filter(item => item.type.includes('KoperasiBulanan')));
      setRekening(rekeningRes.data);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = () => {
    const amount = parseInt(nominal);
    if (!amount || amount <= 0 || !keterangan.trim()) {
      Alert.alert('Error', 'Nominal dan keterangan harus diisi');
      return;
    }
    if (amount > saldo) {
      Alert.alert('Saldo Tidak Cukup', 'Silakan topup saldo terlebih dahulu.');
      return;
    }

    setSaldo(prev => prev - amount);
    setHistory(prev => [
      {
        id: Date.now().toString(),
        nominal: amount,
        ket: keterangan,
        createdAt: new Date().toISOString(),
        status: 'Expense',
      },
      ...prev,
    ]);
    setModalVisible(false);
    setNominal('');
    setKeterangan('');
  };

  const bayar = async () => {
    try {
      await postData('Transaksi/PayBulananKoperasi');
      getDatabase();
      Alert.alert('Berhasil', 'Pembayaran iuran berhasil.');
    } catch (err) {
      Alert.alert('Gagal', err?.message || 'Transaksi gagal.');
    }
  };

  const hasPaidThisMonth = () => {
    const now = new Date();
    return history.some(item => {
      const paidDate = new Date(item.createdAt);
      return (
        paidDate.getMonth() === now.getMonth() &&
        paidDate.getFullYear() === now.getFullYear()
      );
    });
  };

  const formatCurrency = (number) => {
    if (!number) return '';
    return parseInt(number).toLocaleString('id-ID');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f2e3e" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.saldoContainer}>
            <Text style={styles.saldoLabel}>Iuran Wajib Bulanan</Text>
            <Text style={styles.saldoAmount}>Rp {formatCurrency(rekening)}</Text>
          </View>

          {!hasPaidThisMonth() && (
            <TouchableOpacity style={styles.bayarButton} onPress={bayar}>
              <Text style={styles.bayarButtonText}>Bayar Iuran Bulan Ini</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.historyTitle}>Riwayat Iuran</Text>
          {history.length > 0 ? (
            history.map(item => (
              <View key={item.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyKet}>{item.ket}</Text>
                  <Text style={styles.historyDate}>{formatDateTime(item.createdAt)}</Text>
                </View>
                <Text style={[styles.historyNominal, item.status === 'Income' ? styles.income : styles.expense]}>
                  {item.status === 'Income' ? '+ ' : '- '}Rp {formatCurrency(item.nominal)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHistory}>Belum ada riwayat transaksi koperasi.</Text>
          )}

          {/* Modal */}
          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Bayar Iuran</Text>
                <Text style={styles.modalSaldo}>Saldo Anda: Rp {formatCurrency(saldo)}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nominal"
                  value={nominal}
                  onChangeText={(text) => setNominal(text.replace(/\D/g, ''))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Keterangan (contoh: Iuran Bulan Mei 2025)"
                  value={keterangan}
                  onChangeText={setKeterangan}
                  multiline
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
                    <Text style={styles.submitText}>Transfer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </View>
  );
};

export default KoperasiScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  saldoContainer: { alignItems: 'center', marginBottom: 20 },
  saldoLabel: { color: '#6b7280', fontSize: 16, marginBottom: 4 },
  saldoAmount: { color: '#3f2e3e', fontSize: 24, fontWeight: 'bold' },
  bayarButton: { backgroundColor: '#3f2e3e', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  bayarButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', color: '#3f2e3e', marginBottom: 12 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingVertical: 8 },
  historyKet: { fontWeight: 'bold', color: '#3f2e3e' },
  historyDate: { fontSize: 12, color: '#6b7280' },
  historyNominal: { fontWeight: 'bold', fontSize: 14 },
  income: { color: '#16a34a' },
  expense: { color: '#dc2626' },
  noHistory: { textAlign: 'center', color: '#6b7280', marginTop: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContainer: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalSaldo: { fontSize: 14, color: '#3f2e3e', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginLeft: 8 },
  cancelButton: { backgroundColor: '#e5e7eb' },
  cancelText: { color: '#374151', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#3f2e3e' },
  submitText: { color: 'white', fontWeight: 'bold' },
});
