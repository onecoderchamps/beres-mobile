// screen/patungan/PatunganScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../api/service";
import BackButton from "../../components/BackButton";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 kolom, padding 16, gap 16

const PatunganScreen = () => {
  const [loading, setLoading] = useState(true);
  const [patunganData, setPatunganData] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getDatabase();
    getDatabasePatungan();
  }, []);

  const getDatabase = async () => {
    try {
      const response = await getData("auth/verifySessions");
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying session:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Terjadi kesalahan saat memverifikasi sesi."
      );
    }
  };

  const getDatabasePatungan = async () => {
    setLoading(true);
    try {
      const res = await getData("Patungan");
      setPatunganData(res.data);
    } catch (error) {
      console.error("Error fetching Patungan data:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Terjadi kesalahan saat memuat data patungan."
      );
      setPatunganData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.sisaSlot <= 0) return null;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("PatunganActiveDetail", { id: item.id })
        }
        style={[styles.card, { width: cardWidth }]}
      >
        {/* Banner */}
        <Image source={{ uri: item.banner[0] }} style={styles.image} />

        {/* Ribbon Slot */}
        {item.sisaSlot > 0 && (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>Sisa {item.sisaSlot} Slot!</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.keterangan}
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Harga Per Slot</Text>
              <Text style={styles.price}>
                Rp {item.targetPay.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.label}>Total Aset</Text>
              <Text style={styles.asset}>
                Rp {item.totalPrice.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {patunganData.length > 0 ? (
            <FlatList
              data={patunganData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                Tidak ada patungan yang tersedia saat ini.
              </Text>
              <Text style={styles.emptyDesc}>
                Silakan cek kembali nanti atau buat patungan baru.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PatunganScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  ribbon: {
    position: "absolute",
    top: 12,
    right: -36,
    backgroundColor: "red",
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: "45deg" }],
  },
  ribbonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  cardContent: { padding: 12 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  desc: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  row: { flexDirection: "row", marginTop: 8 },
  label: { fontSize: 11, color: "#6b7280" },
  price: { fontSize: 14, fontWeight: "bold", color: "green", marginTop: 2 },
  asset: { fontSize: 14, fontWeight: "bold", color: "#9333ea", marginTop: 2 },
  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, color: "#374151", fontWeight: "bold" },
  emptyDesc: { fontSize: 13, color: "#6b7280", marginTop: 4 },
});
