import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { getData, postData } from "../../../api/service";
import { TrendingUp, Users } from "lucide-react-native";

const Member = ({ data, getPatunganDatabase }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getDatabase = async () => {
    setLoadingUser(true);
    try {
      const response = await getData("auth/verifySessions");
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying user session:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const dummyStockOverviewData = {
    currentValuePerLot:
      data.targetPay * (1 + parseFloat(data.kenaikan) / 100),
    initialValuePerLot: data.targetPay,
    growthPercentage: parseInt(data.kenaikan),
    lastUpdate: new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  const members = Array.isArray(data.memberPatungan)
    ? data.memberPatungan.sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: 40 }]}>{index + 1}.</Text>
      <Text style={[styles.cell, { width: 120 }]}>{item.name}</Text>
      <Text style={[styles.cell, { width: 100 }]}>{item.jumlahLot}</Text>
      <Text
        style={[
          styles.cell,
          { width: 160, color: "green", fontWeight: "bold" },
        ]}
      >
        Rp{" "}
        {(
          item.jumlahLot * dummyStockOverviewData.currentValuePerLot
        ).toLocaleString("id-ID")}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Perkembangan Saham */}
      <Text style={styles.sectionTitle}>
        <TrendingUp size={20} color="#9333ea" /> Perkembangan Saham Umum
      </Text>

      <View style={styles.cardRow}>
        <View style={styles.cardBlue}>
          <Text style={styles.cardLabel}>Nilai Saat Ini per Lembar</Text>
          <Text style={styles.cardValue}>
            Rp {dummyStockOverviewData.currentValuePerLot.toLocaleString("id-ID")}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            dummyStockOverviewData.growthPercentage < 0
              ? styles.cardRed
              : dummyStockOverviewData.growthPercentage === 0
              ? styles.cardBlue
              : styles.cardGreen,
          ]}
        >
          <Text
            style={[
              styles.cardLabel,
              dummyStockOverviewData.growthPercentage < 0
                ? { color: "#b91c1c" }
                : dummyStockOverviewData.growthPercentage === 0
                ? { color: "#1e40af" }
                : { color: "#166534" },
            ]}
          >
            Pergerakan Saham
          </Text>
          <Text style={styles.cardValue}>
            {dummyStockOverviewData.growthPercentage > 0
              ? "+" + dummyStockOverviewData.growthPercentage
              : dummyStockOverviewData.growthPercentage}
            %
          </Text>
        </View>
      </View>

      <View style={styles.cardGray}>
        <Text style={styles.cardLabelGray}>
          Nilai Awal per Lembar: Rp{" "}
          {dummyStockOverviewData.initialValuePerLot.toLocaleString("id-ID")}
        </Text>
        <Text style={styles.cardLabelGray}>
          Update Terakhir: {dummyStockOverviewData.lastUpdate}
        </Text>
        <Text style={styles.cardNote}>
          *Data ini estimasi, nilai aktual bisa berbeda.
        </Text>
      </View>

      {/* Daftar Anggota */}
      <Text style={styles.sectionTitle}>
        <Users size={20} color="#9333ea" /> Daftar Anggota
      </Text>

      {loadingUser ? (
        <ActivityIndicator size="large" color="#9333ea" style={{ margin: 20 }} />
      ) : members.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada anggota yang bergabung.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: 40 }]}>No</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Nama</Text>
              <Text style={[styles.headerCell, { width: 100 }]}>Jumlah Lot</Text>
              <Text style={[styles.headerCell, { width: 160 }]}>Total Nilai</Text>
            </View>

            {/* Body pakai FlatList */}
            <FlatList
              data={members}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#1f2937",
  },
  cardRow: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  cardBlue: { flex: 1, backgroundColor: "#eff6ff", padding: 12, borderRadius: 8 },
  cardRed: { backgroundColor: "#fee2e2" },
  cardGreen: { backgroundColor: "#dcfce7" },
  cardGray: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  cardLabel: { fontSize: 12, fontWeight: "600" },
  cardLabelGray: { fontSize: 12, color: "#6b7280" },
  cardValue: { fontSize: 16, fontWeight: "bold", marginTop: 4 },
  cardNote: { fontSize: 11, fontStyle: "italic", color: "#6b7280", marginTop: 6 },
  emptyText: { textAlign: "center", color: "#6b7280", marginVertical: 20 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  cell: { fontSize: 14, color: "#111827", paddingHorizontal: 4 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
  },
  headerCell: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
    paddingHorizontal: 4,
  },
});

export default Member;
