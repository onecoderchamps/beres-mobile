import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../api/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, HandCoins } from 'lucide-react-native'; // ⬅️ pakai lucide

const AktifitasScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [arisanData, setArisanData] = useState([]);
  const [patunganData, setPatunganData] = useState([]);
  const navigation = useNavigation();

  const getArisanDatabase = async () => {
    try {
      const response = await getData('Arisan/ByUser');
      setArisanData(response.data);
    } catch (error) {
      console.error('Error fetching Arisan data:', error);
    }
  };

  const getPatunganDatabase = async () => {
    try {
      const response = await getData('Patungan/ByUser');
      setPatunganData(response.data);
    } catch (error) {
      console.error('Error fetching Patungan data:', error);
    }
  };

  const fetchData = async () => {
    await Promise.allSettled([getArisanDatabase(), getPatunganDatabase()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const combinedData = [
    ...arisanData.map((item) => ({ ...item, type: 'Arisan' })),
    ...patunganData.map((item) => ({ ...item, type: 'Patungan' })),
  ];

  const handleCardClick = (item) => {
  if (item.type === 'Arisan') {
    navigation.navigate('ArisanDetail', { id: item.id });
  } else if (item.type === 'Patungan') {
    navigation.navigate('PatunganDetail', { id: item.id });
  }
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, borderColor: '#eee' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
          AssetKu
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9333ea']} />
          }
        >
          {combinedData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Anda belum bergabung dengan Arisan atau Patungan apapun.
              </Text>
              <Text style={styles.emptySubText}>
                Mulai eksplorasi untuk menemukan peluang menarik!
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.exploreText}>Cari Aktivitas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardList}>
              {combinedData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => handleCardClick(item)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      item.type === 'Arisan' ? styles.iconArisan : styles.iconPatungan,
                    ]}
                  >
                    {item.type === 'Arisan' ? (
                      <Users size={22} color="#4f46e5" strokeWidth={2.5} />
                    ) : (
                      <HandCoins size={22} color="#16a34a" strokeWidth={2.5} />
                    )}
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2} ellipsizeMode="tail">
                      {item.description || item.keterangan || item.desc || 'Tidak ada keterangan.'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.typeBadge,
                      item.type === 'Arisan' ? styles.badgeArisan : styles.badgePatungan,
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.type}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AktifitasScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  headerSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyState: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, color: '#4b5563', textAlign: 'center' },
  emptySubText: { fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' },
  exploreButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#9333ea',
    borderRadius: 10,
  },
  exploreText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cardList: { marginTop: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconArisan: { backgroundColor: '#e0e7ff' },
  iconPatungan: { backgroundColor: '#dcfce7' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  cardSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeArisan: { backgroundColor: '#4f46e5' },
  badgePatungan: { backgroundColor: '#16a34a' },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
});
