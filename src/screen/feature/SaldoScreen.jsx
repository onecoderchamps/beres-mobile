import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  StyleSheet,
} from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { getData, postData, putData, deleteData } from "../../api/service";

const SaldoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({ balance: 0 });
  const [rekening, setRekening] = useState({ bank: "", holder: "", rekening: "" });
  const [history, setHistory] = useState([]);
  const [saldoOrder, setSaldoOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const getDatabase = useCallback(async () => {
    try {
      setLoading(true);
      const [response, rekeningRes, transaksi, orderSaldoRes] = await Promise.all([
        getData("/auth/verifySessions"),
        getData("/rekening"),
        getData("/transaksi"),
        getData("Order/Saldo"),
      ]);

      setDatas(response.data);
      setRekening(rekeningRes.data);
      setHistory(transaksi.data);

      if (orderSaldoRes.data && orderSaldoRes.data.status === "Pending") {
        setSaldoOrder(orderSaldoRes.data);
        setUploadedImageUrl(orderSaldoRes.data.image && orderSaldoRes.data.image !== "null" ? orderSaldoRes.data.image : "");
        setSelectedFile(null);
      } else {
        setSaldoOrder(null);
        setUploadedImageUrl("");
        setSelectedFile(null);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memuat data");
      setLoading(false);
    }
  }, []);

  useEffect(() => { getDatabase(); }, [getDatabase]);

  // Permission functions
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        { title: "Izin Kamera", message: "Aplikasi butuh akses kamera" }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        { title: "Izin Galeri", message: "Aplikasi butuh akses galeri" }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Pick image from gallery
  const pickImageFromLibrary = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) { Alert.alert("Izin ditolak", "Tidak bisa mengakses galeri"); return; }

    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const asset = response.assets[0];
        setSelectedFile(asset);
        setUploadedImageUrl(asset.uri);
      }
    });
  };

  // Pick image from camera
  const pickImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) { Alert.alert("Izin ditolak", "Tidak bisa mengakses kamera"); return; }

    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const asset = response.assets[0];
        setSelectedFile(asset);
        setUploadedImageUrl(asset.uri);
      }
    });
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", { uri: file.uri, type: file.type || "image/jpeg", name: file.fileName || "file.jpg" });
    const res = await postData("/file/upload", formData, true);
    if (res.status && res.path) return res.path;
    throw new Error(res.message || "Gagal upload file");
  };

  const handleUploadProof = async () => {
    if (!saldoOrder?.id) { Alert.alert("Error", "Tidak ada order aktif"); return; }
    if (!selectedFile && (!uploadedImageUrl || uploadedImageUrl==="null")) { Alert.alert("Error", "Pilih gambar untuk diunggah"); return; }

    setUploadingImage(true);
    try {
      let imageUrlToSave = uploadedImageUrl;
      if (selectedFile) imageUrlToSave = await uploadFileToServer(selectedFile);
      await putData("Order/Saldo", { id: saldoOrder.id, status: "Pending", image: imageUrlToSave });
      Alert.alert("Sukses", "Bukti transfer berhasil diunggah");
      setSelectedFile(null);
      getDatabase();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal mengunggah bukti transfer");
    } finally { setUploadingImage(false); }
  };

  const handleCreateTopUpOrder = async () => {
    const amount = Number(topUpAmount.replace(/\./g,""));
    if (isNaN(amount) || amount <= 0) { Alert.alert("Error", "Jumlah top up tidak valid"); return; }

    setIsCreatingOrder(true);
    try {
      await postData("Order/Saldo", { price: amount, image: null });
      Alert.alert("Sukses", "Order top up dibuat, unggah bukti transfer");
      setIsTopUpModalOpen(false);
      setTopUpAmount("");
      getDatabase();
    } catch (error) { console.error(error); Alert.alert("Error", "Gagal membuat order top up"); }
    finally { setIsCreatingOrder(false); }
  };

  const handleCancelTopUp = async () => {
    if (!saldoOrder?.id) { Alert.alert("Error", "Tidak ada order aktif"); return; }
    Alert.alert("Konfirmasi", "Batalkan top up?", [
      { text:"Tidak", style:"cancel" },
      { text:"Ya", onPress: async () => {
        setIsCancellingOrder(true);
        try { await deleteData(`Order/${saldoOrder.id}`); Alert.alert("Sukses", "Top up dibatalkan"); getDatabase(); }
        catch(e){ console.error(e); Alert.alert("Error", "Gagal membatalkan top up"); }
        finally { setIsCancellingOrder(false); }
      }}
    ]);
  };

  const totalTransferAmount = saldoOrder ? saldoOrder.price + saldoOrder.uniqueCode : 0;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ flex:1 }} size="large" color="#16a34a"/>
      ) : (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Anda</Text>
          <Text style={styles.balanceValue}>Rp {datas.balance.toLocaleString("id-ID")}</Text>
        </View>

        {saldoOrder ? (
          <View style={styles.topUpCard}>
            <Text style={styles.topUpTitle}>Detail Top Up</Text>
            <Text>Jumlah transfer: Rp {totalTransferAmount.toLocaleString("id-ID")}</Text>
            <Text>Bank: {rekening.bank}</Text>
            <Text>Rekening: {rekening.rekening}</Text>
            <Text>Atas Nama: {rekening.holder}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={pickImageFromLibrary} style={styles.buttonPrimary}><Text style={styles.buttonText}>Upload Bukti Transfer</Text></TouchableOpacity>
              {/* <TouchableOpacity onPress={pickImageFromCamera} style={styles.buttonPrimary}><Text style={styles.buttonText}>Kamera</Text></TouchableOpacity> */}
            </View>

            {uploadedImageUrl ? (
              <>
                <TouchableOpacity onPress={()=>setIsImageViewerOpen(true)}>
                  <Image source={{ uri: uploadedImageUrl }} style={styles.imagePreview} resizeMode="contain"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUploadProof} disabled={uploadingImage} style={styles.buttonUpload}>
                  <Text style={styles.buttonText}>{uploadingImage?"Mengunggah...":"Unggah Bukti"}</Text>
                </TouchableOpacity>
              </>
            ) : null}

            <TouchableOpacity onPress={handleCancelTopUp} disabled={isCancellingOrder} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>{isCancellingOrder?"Membatalkan...":"Batalkan Top Up"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={()=>setIsTopUpModalOpen(true)} style={styles.buttonCreate}>
            <Text style={styles.buttonText}>Ajukan Top Up Baru</Text>
          </TouchableOpacity>
        )}

        {/* History */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
          {history.length>0 ? history.map(item=>(
            <View key={item.id} style={styles.historyRow}>
              <View>
                <Text style={styles.historyKet}>{item.ket}</Text>
                <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={[styles.historyAmount, {color:item.status==="Income"?"green":"red"}]}>
                {item.status==="Income"?"+":"-"} Rp {item.nominal.toLocaleString("id-ID")}
              </Text>
            </View>
          )) : <Text style={styles.historyEmpty}>Belum ada riwayat transaksi</Text>}
        </View>
      </ScrollView>
      )}

      {/* Top Up Modal */}
      <Modal visible={isTopUpModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ajukan Top Up</Text>
            <TextInput
              placeholder="Jumlah top up"
              keyboardType="numeric"
              value={topUpAmount}
              onChangeText={text=>setTopUpAmount(text.replace(/\D/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
              style={styles.modalInput}
            />
            <View style={{ flexDirection:"row", justifyContent:"flex-end" }}>
              <TouchableOpacity onPress={()=>setIsTopUpModalOpen(false)} style={{ padding:12, marginRight:8 }}><Text>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreateTopUpOrder} style={styles.buttonPrimary}><Text style={styles.buttonText}>{isCreatingOrder?"Membuat Order":"Buat Order"}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Image Modal */}
      <Modal visible={isImageViewerOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex:1 }} onPress={()=>setIsImageViewerOpen(false)}>
            <Image source={{ uri: uploadedImageUrl }} style={{ flex:1, width:null, height:null }} resizeMode="contain"/>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#f9fafb" },
  scrollContainer:{ padding:16, paddingBottom:50 },
  balanceCard:{ backgroundColor:"#16a34a", padding:20, borderRadius:12, marginBottom:20 },
  balanceLabel:{ color:"white", fontSize:14, opacity:0.8 },
  balanceValue:{ color:"white", fontSize:26, fontWeight:"bold" },
  topUpCard:{ backgroundColor:"white", padding:16, borderRadius:12, marginBottom:20 },
  topUpTitle:{ fontSize:18, fontWeight:"bold", marginBottom:12 },
  buttonRow:{ flexDirection:"row", marginTop:12 },
  buttonPrimary:{ flex:1, padding:12, backgroundColor:"#4f46e5", marginHorizontal:3, borderRadius:8, alignItems:"center" },
  buttonText:{ color:"white", textAlign:"center" },
  imagePreview:{ width:"100%", height:200, marginTop:12, borderRadius:8 },
  buttonUpload:{ padding:12, backgroundColor:"#2563eb", borderRadius:8, marginTop:8, alignItems:"center" },
  buttonCancel:{ padding:12, backgroundColor:"#dc2626", borderRadius:8, marginTop:8, alignItems:"center" },
  buttonCreate:{ padding:12, backgroundColor:"#2563eb", borderRadius:8, alignItems:"center", marginBottom:20 },
  historyCard:{ backgroundColor:"white", padding:16, borderRadius:12, marginBottom:20 },
  historyTitle:{ fontSize:18, fontWeight:"bold", marginBottom:12 },
  historyRow:{ flexDirection:"row", justifyContent:"space-between", paddingVertical:6, borderBottomWidth:1, borderColor:"#e5e7eb" },
  historyKet:{ fontWeight:"bold" },
  historyDate:{ fontSize:12, color:"#6b7280" },
  historyAmount:{ fontWeight:"bold", fontSize:14 },
  historyEmpty:{ textAlign:"center", color:"#6b7280", padding:8 },
  modalOverlay:{ flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center", padding:16 },
  modalContainer:{ backgroundColor:"white", width:"100%", maxWidth:400, borderRadius:12, padding:20 },
  modalTitle:{ fontSize:20, fontWeight:"bold", marginBottom:12 },
  modalInput:{ borderWidth:1, borderColor:"#d1d5db", borderRadius:8, padding:12, marginBottom:12 },
});

export default SaldoScreen;
