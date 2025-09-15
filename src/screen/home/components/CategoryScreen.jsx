import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../../api/service';
import { 
  GraduationCap, 
  Store, 
  Gem, 
  Heart, 
  Handshake, 
  Smartphone, 
  PieChart 
} from 'lucide-react-native';

const categories = [
  { key: 'Edukasi', label: 'Edukasi', icon: GraduationCap },
  { key: 'Patungan', label: 'Patungan', icon: Store },
  { key: 'Arisan', label: 'Arisan', icon: Gem },
  { key: 'Sedekah', label: 'Sedekah', icon: Heart },
  { key: 'Koperasi', label: 'Koperasi', icon: Handshake },
  { key: 'PPOB', label: 'PPOB', icon: Smartphone },
//   { key: 'MyAsset', label: 'AssetKu', icon: PieChart },
];

const CategorySelector = () => {
  const [dataProfile, setDataProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showKoperasiModal, setShowKoperasiModal] = useState(false);
  const navigation = useNavigation();

  const getDatabaseUser = async () => {
    setLoadingProfile(true);
    try {
      const response = await getData('auth/verifySessions');
      setDataProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getDatabaseUser();
  }, []);

  const handleCategorySelect = (key) => {
    if (loadingProfile) {
      alert("Mohon tunggu, data pengguna sedang dimuat...");
      return;
    }

    const memberRequiredCategories = ['Patungan', 'Arisan', 'MyAsset'];

    if (memberRequiredCategories.includes(key) && !dataProfile?.isPayMonthly) {
      setShowKoperasiModal(true);
      return;
    }

    switch (key) {
      case 'Arisan':
        navigation.navigate('ArisanScreen');
        break;
      case 'Patungan':
        navigation.navigate('PatunganScreen');
        break;
      case 'Koperasi':
        navigation.navigate('KoperasiScreen');
        break;
      case 'Sedekah':
        navigation.navigate('SedekahScreen');
        break;
      case 'MyAsset':
        navigation.navigate('AktifitasPage');
        break;
      case 'MyProfile':
        navigation.navigate('AkunPage');
        break;
      case 'Edukasi':
        navigation.navigate('EdukasiScreen');
        break;
      case 'PPOB':
        navigation.navigate('PPOBScreen');
        break;
      default:
        alert("Fitur Segera Hadir!");
        break;
    }
  };

  const handleRegisterNow = () => {
    setShowMembershipModal(false);
    navigation.navigate('RegisterScreen');
  };

  const handleKoperasiNow = () => {
    setShowKoperasiModal(false);
    navigation.navigate('KoperasiScreen');
  };

  return (
    <View style={styles.container}>
      {loadingProfile ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <View style={styles.grid}>
          {categories.map(({ key, label, icon: Icon }) => (
            <TouchableOpacity
              key={key}
              style={styles.card}
              onPress={() => handleCategorySelect(key)}
              disabled={loadingProfile}
            >
              <Icon size={28} color="#1f2937" />
              <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Membership Modal */}
      <Modal visible={showMembershipModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Akses Terbatas!</Text>
            <Text style={styles.modalText}>
              Kamu belum menjadi member koperasi. Untuk mengakses fitur ini, silakan daftar terlebih dahulu.
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleRegisterNow}>
              <Text style={styles.modalBtnText}>Daftar Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setShowMembershipModal(false)}>
              <Text style={styles.modalBtnSecondaryText}>Nanti Saja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Koperasi Modal */}
      <Modal visible={showKoperasiModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Akses Terbatas!</Text>
            <Text style={styles.modalText}>
              Kamu belum membayar iuran bulanan. Untuk mengakses fitur ini, silakan membayar terlebih dahulu.
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleKoperasiNow}>
              <Text style={styles.modalBtnText}>Bayar Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setShowKoperasiModal(false)}>
              <Text style={styles.modalBtnSecondaryText}>Nanti Saja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: { padding: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#374151', textAlign: 'center', marginBottom: 16 },
  modalBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '600' },
  modalBtnSecondary: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecondaryText: { color: '#374151', fontWeight: '600' },
});
