import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getData, postData } from "../../api/service";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react-native";
import Deskripsi from "./components/Deskripsi";
import Syarat from "./components/Syarat";
import Peserta from "./components/Peserta";

const PatunganDetail = ({ route, navigation }) => {
    //   const route = useRoute();
    //   const navigation = useNavigation();
    const { id } = route.params;

    const [activeTab, setActiveTab] = useState("Deskripsi");
    const [modalVisible, setModalVisible] = useState(false);
    const [jumlahLot, setJumlahLot] = useState(1);
    const [nominal, setNominal] = useState(0);
    const [detailData, setDetailData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const iuranWajibPerLot = detailData?.targetPay || 0;

    const getUserData = async () => {
        try {
            const res = await getData("auth/verifySessions");
            setUserData(res.data);
        } catch (err) {
            console.log("Error user:", err);
        }
    };

    const getPatunganData = async () => {
        setLoading(true);
        try {
            const res = await getData("Patungan/" + id);
            setDetailData(res.data);
        } catch (err) {
            console.log("Error patungan:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatunganData();
    }, []);

    useEffect(() => {
        setNominal(jumlahLot * iuranWajibPerLot);
    }, [jumlahLot, iuranWajibPerLot]);

    const handleJoin = async () => {
        if (!userData) return;
        try {
            await postData("Patungan/AddNewPatunganMember", {
                idUser: userData?.phone,
                idPatungan: id,
                phoneNumber: userData?.phone,
                jumlahLot,
                isActive: true,
                isPayed: false,
            });
            alert("Berhasil membeli asset!");
            getPatunganData();
            setModalVisible(false);
            setJumlahLot(1);
        } catch (err) {
            console.log("Error join:", err.errorMessage.Error);
            Alert.alert("Pemberitahuan",err);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Loader2 size={40} color="purple" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Banner */}
                {detailData?.banner && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {detailData.banner.map((b, idx) => (
                            <Image
                                key={idx}
                                source={{ uri: b }}
                                style={styles.banner}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {["Deskripsi", "Syarat", "Peserta"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && { color: "white" },
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content */}
                <View style={{ marginTop: 16 }}>
                    {activeTab === "Deskripsi" && (
                        <Deskripsi data={detailData} />
                    )}
                    {activeTab === "Syarat" && (
                        <Syarat data={detailData}/>
                    )}
                    {activeTab === "Peserta" && (
                        <Peserta data={detailData} />
                    )}
                </View>
            </ScrollView>

            {/* Floating Button */}
            {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisible(true);
          getUserData();
        }}
      >
        <Plus size={24} color="white" />
        <Text style={{ color: "white", marginLeft: 6 }}>Beli Asset</Text>
      </TouchableOpacity> */}

            {/* Modal Beli Asset */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Beli Asset</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {userData ? (
                            <>
                                <Text>Saldo: Rp {userData.balance?.toLocaleString("id-ID")}</Text>
                                <Text>Harga Per Lot: Rp {iuranWajibPerLot.toLocaleString("id-ID")}</Text>

                                <View style={styles.lotControl}>
                                    <TouchableOpacity
                                        style={styles.lotBtn}
                                        onPress={() => setJumlahLot((prev) => Math.max(1, prev - 1))}
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.lotInput}
                                        value={jumlahLot.toString()}
                                        onChangeText={(v) =>
                                            setJumlahLot(Math.max(1, parseInt(v) || 1))
                                        }
                                        keyboardType="numeric"
                                    />
                                    <TouchableOpacity
                                        style={styles.lotBtn}
                                        onPress={() => setJumlahLot((prev) => prev + 1)}
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={{ marginTop: 12 }}>
                                    Total: Rp {nominal.toLocaleString("id-ID")}
                                </Text>

                                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
                                    >
                                        <Text>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleJoin}
                                        style={[styles.modalBtn, { backgroundColor: "green" }]}
                                    >
                                        <Text style={{ color: "white" }}>Bayar Sekarang</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <ActivityIndicator size="large" color="purple" />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    headerTitle: { marginLeft: 12, fontSize: 18, fontWeight: "bold" },
    banner: { width: 300, height: 160, marginRight: 12, borderRadius: 12 },
    tabContainer: { flexDirection: "row", marginTop: 12 },
    tab: {
        flex: 1,
        padding: 10,
        marginHorizontal: 4,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        alignItems: "center",
    },
    activeTab: { backgroundColor: "purple" },
    tabText: { fontWeight: "600", color: "#374151" },
    fab: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "purple",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,
        elevation: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: "purple" },
    lotControl: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    lotBtn: {
        width: 36,
        height: 36,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
    },
    lotInput: {
        width: 60,
        borderBottomWidth: 1,
        marginHorizontal: 8,
        textAlign: "center",
        fontSize: 16,
    },
    modalBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 8,
    },
});

export default PatunganDetail;
