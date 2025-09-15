import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Home, Store, Building2, Warehouse } from 'lucide-react-native';

const iconMap = {
  rumah: { Icon: Home, color: '#34D399' },   // green
  retail: { Icon: Store, color: '#60A5FA' }, // blue
  ruko: { Icon: Building2, color: '#FBBF24' }, // amber
  aset: { Icon: Warehouse, color: '#A78BFA' }, // violet (default)
};

const ArisanComponent = ({ data }) => {
  const { Icon: SelectedIcon, color: iconColor } = iconMap[data.type] || iconMap['aset'];

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
            <Text style={styles.badgeText}>Sisa {data.sisaSlot} Slot!</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <SelectedIcon size={20} color={iconColor} style={{ marginRight: 6 }} />
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
        </View>

        <Text style={styles.desc} numberOfLines={2}>
          {data.keterangan}
        </Text>

        {/* Details */}
        <View style={styles.detailRow}>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Bidang Properti</Text>
            <Text style={styles.value} numberOfLines={1}>
              {data.keterangan}
            </Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Iuran / Bulan</Text>
            <Text style={styles.value}>
              Rp {data.targetPay ? data.targetPay.toLocaleString('id-ID') : '0'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ArisanComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  desc: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    gap: 12,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
});
