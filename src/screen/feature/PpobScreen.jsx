import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Lucide from 'lucide-react-native'; // Semua icon dari lucide

const PPOBScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [saldo, setSaldo] = useState(500000);

  const ppobServices = [
    { id: 'pulsa', name: 'Pulsa & Data', icon: Lucide.Phone, color: '#3b82f6', bgColor: '#dbebff' },
    { id: 'pln', name: 'Token & Tagihan PLN', icon: Lucide.Zap, color: '#facc15', bgColor: '#fff9db' },
    { id: 'pdam', name: 'PDAM', icon: Lucide.Droplet, color: '#06b6d4', bgColor: '#dbf5fa' },
    { id: 'internet', name: 'Internet & TV Kabel', icon: Lucide.Wifi, color: '#a78bfa', bgColor: '#f3ebff' },
    { id: 'bpjs', name: 'BPJS Kesehatan', icon: Lucide.Heart, color: '#22c55e', bgColor: '#dcfce7' },
    { id: 'multifinance', name: 'Angsuran Kredit', icon: Lucide.CreditCard, color: '#6366f1', bgColor: '#eaeaff' },
    { id: 'pascabayar', name: 'Telepon Pascabayar', icon: Lucide.PhoneCall, color: '#14b8a6', bgColor: '#d2fafa' },
    { id: 'voucher_game', name: 'Voucher Game', icon: Lucide.Gamepad2, color: '#ef4444', bgColor: '#ffeaea' },
    { id: 'tiket', name: 'Tiket (Kereta/Pesawat)', icon: Lucide.Ticket, color: '#ec4899', bgColor: '#ffe0f0' },
  ];

  const formatCurrency = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '';
    return number.toLocaleString('id-ID');
  };

  const handleServiceClick = () => {
    Alert.alert('Segera Hadir!', 'Fitur ini akan tersedia segera.');
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f2e3e" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.grid}>
            {ppobServices.map(service => (
              <TouchableOpacity
                key={service.id}
                style={styles.card}
                onPress={handleServiceClick}
              >
                <View style={[styles.iconContainer, { backgroundColor: service.bgColor }]}>
                  <service.icon size={28} color={service.color} />
                </View>
                <Text style={styles.cardText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Punya kebutuhan pembayaran lain?</Text>
            <Text style={styles.footerSubText}>Hubungi dukungan kami untuk bantuan lebih lanjut.</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PPOBScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '30%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  cardText: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#1f2937' },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#6b7280' },
  footerSubText: { fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
});
