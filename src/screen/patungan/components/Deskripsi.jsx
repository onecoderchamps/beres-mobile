import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { X as CloseIcon, FileText, MapPin, DollarSign, Image as ImageIcon } from "lucide-react-native";

const Deskripsi = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Judul */}
      <Text style={styles.sectionTitle}>Detail Asset</Text>

      {/* Detail Asset */}
      <View style={styles.detailRow}>
        <View style={styles.label}>
          <FileText size={18} color="#9333ea" />
          <Text style={styles.labelText}>Nama Asset</Text>
        </View>
        <Text style={styles.value}>{data.title}</Text>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.label}>
          <MapPin size={18} color="#9333ea" />
          <Text style={styles.labelText}>Alamat</Text>
        </View>
        <Text style={[styles.value, { flex: 1, textAlign: "right" }]} numberOfLines={2}>
          {data.keterangan}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.label}>
          <DollarSign size={18} color="#9333ea" />
          <Text style={styles.labelText}>Harga Total</Text>
        </View>
        <Text style={[styles.value, { color: "green", fontWeight: "bold" }]}>
          Rp {data.totalPrice?.toLocaleString("id-ID")}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.label}>
          <DollarSign size={18} color="#9333ea" />
          <Text style={styles.labelText}>Harga / Lembar</Text>
        </View>
        <Text style={[styles.value, { color: "green", fontWeight: "bold" }]}>
          Rp {data.targetPay?.toLocaleString("id-ID")}
        </Text>
      </View>

      {/* Deskripsi */}
      <Text style={styles.sectionTitle}>Deskripsi Detail</Text>
      <Text style={styles.description}>
        {data.desc || "Tidak ada deskripsi tersedia untuk asset ini."}
      </Text>

      {/* Dokumen */}
      <Text style={styles.sectionTitle}>Dokumen Pendukung</Text>
      {data.doc && data.doc.length > 0 ? (
        <View style={styles.docGrid}>
          {data.doc.map((docUri, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.docItem}
              onPress={() => openImage(docUri)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: docUri }} style={styles.docImage} />
              <View style={styles.docOverlay}>
                <ImageIcon size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyDoc}>Tidak ada dokumen yang dilampirkan.</Text>
      )}

      {/* Modal Gambar */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
            <CloseIcon size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    paddingBottom: 8,
  },
  label: { flexDirection: "row", alignItems: "center" },
  labelText: { marginLeft: 6, color: "#6b7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14, fontWeight: "600" },
  description: { fontSize: 14, color: "#374151", lineHeight: 20, marginBottom: 16 },
  docGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  docItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  docImage: { width: "100%", height: "100%" },
  docOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  emptyDoc: { textAlign: "center", color: "#6b7280", fontStyle: "italic" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  fullImage: { width: "100%", height: "80%" },
});

export default Deskripsi;
