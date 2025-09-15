import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { getData } from "../../../api/service";
import { X } from "lucide-react-native";

const Syarat = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [datas, setDatas] = useState("");

  const getDatabase = async () => {
    try {
      const response = await getData("rekening/SettingPatungan");
      setDatas(response.data);
    } catch (error) {
      alert(
        error?.response?.data?.message || "Terjadi kesalahan saat memverifikasi."
      );
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

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
      <Text style={styles.title}>Syarat dan Ketentuan</Text>
      <Text style={styles.text}>{datas}</Text>

      {/* Modal Gambar Fullscreen */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeImage}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
});

export default Syarat;
