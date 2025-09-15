import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../api/service';
// import EventList from '../../component/EventList';
import { Bot, MessageCircle } from 'lucide-react-native';
import HeaderScreen from './components/HeaderScreen';
import MembershipScreen from './components/MembershipScreen';
import CategoryScreen from './components/CategoryScreen';
import ArisanScreen from './components/ArisanScreen';
import PatunganScreen from './components/PatunganScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
  const navigation = useNavigation();
  const [patunganData, setPatunganData] = useState([]);
  const [arisanData, setArisanData] = useState([]);
  const [loadingPatungan, setLoadingPatungan] = useState(true);
  const [loadingArisan, setLoadingArisan] = useState(true);
  const [errorPatungan, setErrorPatungan] = useState(null);
  const [errorArisan, setErrorArisan] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeOrderSaldo, setActiveOrderSaldo] = useState(null);

  const getDatabasePatungan = useCallback(async () => {
    setLoadingPatungan(true);
    setErrorPatungan(null);
    try {
      const res = await getData('Patungan');
      setPatunganData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      setErrorPatungan("Gagal memuat data Patungan.");
    } finally {
      setLoadingPatungan(false);
    }
  }, []);

  const getDatabaseArisan = useCallback(async () => {
    setLoadingArisan(true);
    setErrorArisan(null);
    try {
      const res = await getData('Arisan');
      setArisanData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      setErrorArisan("Gagal memuat data Arisan.");
    } finally {
      setLoadingArisan(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getData('event');
      const futureEvents = res.data.filter(event => new Date(event.dueDate) >= new Date());
      futureEvents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setEvents(futureEvents);
    } catch (err) {
      console.error('Gagal memuat event:', err);
    }
  }, []);

  const fetchActiveOrderSaldo = useCallback(async () => {
    try {
      const res = await getData("Order/Saldo");
      if (res.data?.status === 'Pending') {
        setActiveOrderSaldo(res.data);
      } else {
        setActiveOrderSaldo(null);
      }
    } catch (error) {
      setActiveOrderSaldo(null);
    }
  }, []);

  useEffect(() => {
    getDatabasePatungan();
    getDatabaseArisan();
    fetchEvents();
    fetchActiveOrderSaldo();
  }, [getDatabasePatungan, getDatabaseArisan, fetchEvents, fetchActiveOrderSaldo]);

  const renderContent = (data, loading, error, Component, navigatePath) => {
    if (loading) return <Text style={styles.loading}>Memuat data...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;
    if (data.length === 0) return <Text style={styles.empty}>Belum ada data tersedia.</Text>;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 12 }}>
        {data.map((item, idx) => (
          (item.sisaSlot === undefined || item.sisaSlot > 0) && (
            <TouchableOpacity
              key={item.id || idx}
              onPress={() => navigation.navigate(navigatePath, { id: item.id })}
              style={{ marginRight: 12, width: 250 }}
              activeOpacity={0.9}
            >
              <Component data={item} />
            </TouchableOpacity>
          )
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ padding: 16 }}>
          <HeaderScreen />
          <MembershipScreen navigation={navigation}/>
          <CategoryScreen />
          <View>
            <Text style={styles.sectionTitle}>Promo Patungan</Text>
            {renderContent(patunganData, loadingPatungan, errorPatungan, PatunganScreen, 'PatunganDetail')}
          </View>
          {/* <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Promo Arisan</Text>
            {renderContent(arisanData, loadingArisan, errorArisan, ArisanScreen, 'ArisanDetail')}
          </View> */}
        </View>

        {/* {events.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Event Mendatang</Text>
            <EventList events={events} />
          </View>
        )} */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 PT PATUNGAN PROPERTI INTERNASIONAL</Text>
        </View>
      </ScrollView>

      {activeOrderSaldo && (
        <TouchableOpacity
          style={styles.saldoNotif}
          onPress={() => navigation.navigate('SaldoScreen')}
          activeOpacity={0.9}
        >
          <Text style={styles.saldoNotifTitle}>Ada Transaksi Top Up Aktif!</Text>
          <Text style={styles.saldoNotifDesc}>Klik untuk melanjutkan pembayaran atau mengunggah bukti.</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen')}
        style={styles.fab}
        activeOpacity={0.9}
      >
        <Bot color="#fff" size={22} style={{ marginRight: 6 }} />
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Beres AI</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loading: { textAlign: 'center', padding: 16, color: '#6b7280' },
  error: { textAlign: 'center', padding: 16, color: '#ef4444' },
  empty: { textAlign: 'center', padding: 16, color: '#6b7280' },
  footer: { marginTop: 36, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#9ca3af' },
  saldoNotif: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2563eb',
    padding: 14,
    alignItems: 'center',
  },
  saldoNotifTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  saldoNotifDesc: { color: '#fff', fontSize: 12, opacity: 0.9 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    elevation: 5,
  },
});
