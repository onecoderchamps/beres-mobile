import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Md... icons
import { getData, postData } from "../../../api/service";

const MembershipCard = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ balance: 0 });
  const [showModal, setShowModal] = useState(false);
  const [tujuan, setTujuan] = useState("");
  const [nominal, setNominal] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);

  const getBalance = async () => {
    setLoading(true);
    try {
      const response = await getData("auth/verifySessions");
      setData(response.data);
      setModalError("");
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const formatCurrency = (numberString) => {
    const number =
      typeof numberString === "string"
        ? parseInt(numberString.replace(/\D/g, ""), 10)
        : numberString;
    if (isNaN(number)) return "0";
    return number.toLocaleString("id-ID");
  };

  const handleNominalChange = (text) => {
    const raw = text.replace(/\D/g, "");
    setNominal(raw);
    setModalError("");
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    let cleaned = number.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("08")) {
      cleaned = "62" + cleaned.slice(1);
    } else if (cleaned.startsWith("+62")) {
      cleaned = cleaned.slice(1);
    } else if (cleaned.startsWith("8")) {
      cleaned = "62" + cleaned;
    }
    return cleaned.startsWith("62") ? "+" + cleaned : cleaned;
  };

  const handleTransfer = async () => {
    setModalError("");
    setTransferSuccess(false);

    if (!tujuan.trim()) {
      setModalError("Nomor ponsel tujuan tidak boleh kosong.");
      return;
    }
    if (!nominal.trim() || parseFloat(nominal) <= 0) {
      setModalError("Nominal transfer tidak valid.");
      return;
    }
    if (parseFloat(nominal) > data.balance) {
      setModalError("Saldo tidak mencukupi.");
      return;
    }

    const formattedPhone = formatPhoneNumber(tujuan);
    if (!formattedPhone.startsWith("+62") || formattedPhone.length < 10) {
      setModalError("Format nomor tidak valid. Gunakan format 08xx atau +628xx.");
      return;
    }

    setModalLoading(true);
    try {
      const formData = { phone: formattedPhone, balance: parseFloat(nominal) };
      await postData("user/Transfer", formData);

      setTransferSuccess(true);
      await getBalance();
      setTujuan("");
      setNominal("");
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Transfer error:", error);
      setModalError(error || "Terjadi kesalahan saat transfer.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* Saldo */}
        <TouchableOpacity style={{ flex: 1 }} onPress={getBalance}>
          <Text style={styles.label}>Saldo Tersedia</Text>
          {loading ? (
            <Text style={styles.balance}>Rp ...</Text>
          ) : (
            <Text style={styles.balance}>Rp {formatCurrency(data.balance)}</Text>
          )}
          <Text style={styles.refreshText}>Klik untuk update saldo</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          {data.role === "2" && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setShowModal(true);
                setModalError("");
                setTujuan("");
                setNominal("");
                setTransferSuccess(false);
              }}
            >
              <Icon name="swap-horiz" size={28} color="#374151" />
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("SaldoScreen")}
          >
            <Icon name="add-circle-outline" size={28} color="#374151" />
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Transfer */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {transferSuccess ? (
              <View style={styles.successBox}>
                <Icon name="check-circle" size={50} color="green" />
                <Text style={styles.successText}>Transfer Berhasil!</Text>
                <Text style={styles.successSub}>
                  Rp {formatCurrency(nominal)} ditransfer ke {tujuan}
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Transfer Dana</Text>

                {/* Input Phone */}
                <View style={styles.inputRow}>
                  <Icon name="phone" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Nomor Ponsel Tujuan"
                    value={tujuan}
                    onChangeText={(t) => {
                      setTujuan(t);
                      setModalError("");
                    }}
                    style={styles.input}
                    keyboardType="phone-pad"
                    editable={!modalLoading}
                  />
                </View>

                {/* Input Nominal */}
                <View style={styles.inputRow}>
                  <Icon name="attach-money" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Nominal Transfer"
                    value={formatCurrency(nominal)}
                    onChangeText={handleNominalChange}
                    style={styles.input}
                    keyboardType="numeric"
                    editable={!modalLoading}
                  />
                </View>

                {modalError ? (
                  <Text style={styles.errorText}>{modalError}</Text>
                ) : null}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleTransfer}
                    disabled={modalLoading}
                    style={[styles.button, { backgroundColor: "#DC2626" }]}
                  >
                    {modalLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Transfer</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    disabled={modalLoading}
                    style={[styles.button, { backgroundColor: "#E5E7EB" }]}
                  >
                    <Text style={[styles.buttonText, { color: "#111" }]}>
                      Batal
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MembershipCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  balance: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  refreshText: {
    fontSize: 12,
    color: "#CA8A04",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionItem: {
    alignItems: "center",
    marginLeft: 12,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    color: "#374151",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
  successBox: {
    alignItems: "center",
    padding: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "green",
    marginTop: 8,
  },
  successSub: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
