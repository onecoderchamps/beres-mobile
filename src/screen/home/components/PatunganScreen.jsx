import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Home, Store, Building2, Warehouse } from 'lucide-react-native';

const iconMap = {
  rumah: <Home size={18} color="#2563eb" style={{ marginRight: 4 }} />,
  retail: <Store size={18} color="#10b981" style={{ marginRight: 4 }} />,
  ruko: <Building2 size={18} color="#f97316" style={{ marginRight: 4 }} />,
  aset: <Warehouse size={18} color="#9333ea" style={{ marginRight: 4 }} />,
};

const PatunganCard = ({ data }) => {
  const iconInfo = iconMap[data.type] || iconMap["aset"];

  const percent =
    data.terkumpul && data.totalPrice && data.totalPrice !== 0
      ? Math.min(100, (data.terkumpul / data.totalPrice) * 100)
      : 0;

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: data.banner && data.banner[0] 
              ? data.banner[0] 
              : 'https://via.placeholder.com/300x150?text=No+Image',
          }}
          style={styles.image}
        />
        {data.sisaSlot > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sisa {data.sisaSlot} Slot</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconInfo}
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {data.keterangan}
        </Text>

        {/* Price Details */}
        <View style={styles.priceRow}>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Harga / Lembar</Text>
            <Text style={styles.priceValue}>
              Rp {data.targetPay ? data.targetPay.toLocaleString('id-ID') : '0'}
            </Text>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Total Aset</Text>
            <Text style={styles.priceValue}>
              Rp {data.totalPrice ? data.totalPrice.toLocaleString('id-ID') : '0'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PatunganCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageWrapper: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#facc15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  desc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
});
