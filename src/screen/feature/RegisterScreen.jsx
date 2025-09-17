import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal
} from 'react-native';
import { getData, postData } from '../../api/service';
import terms from '../../data/syaratketentuan.json';

const RegisterScreen = ({ navigation }) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [noNIK, setNoNIK] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [isAgreedFee, setIsAgreedFee] = useState(false);
    const [rekening, setRekening] = useState(0);

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const getDatabase = async () => {
            try {
                const response = await getData('rekening/SettingIuranTahunan');
                setRekening(response.data);
            } catch (error) {
                console.error("Error fetching annual fee setting:", error);
                alert(error?.response?.data?.message || "Terjadi kesalahan saat memuat biaya tahunan.");
                setRekening(0);
            }
        };
        getDatabase();
    }, []);

    const handleRegister = async () => {
        if (!fullname.trim() || !address.trim() || !email.trim() || !noNIK.trim()) {
            alert('Semua field wajib diisi.');
            return;
        }
        if (!isAgreed || !isAgreedFee) {
            alert('Kamu harus menyetujui semua persyaratan terlebih dahulu.');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmRegister = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
            const userData = { fullname, email, noNIK, address };
            await postData('auth/updateProfile', userData);
            alert('Pendaftaran berhasil.');
            navigation.navigate('MainTabs');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err || "Terjadi kesalahan saat pendaftaran.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

            {/* Input Fullname */}
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap Anda"
                value={fullname}
                onChangeText={setFullname}
            />

            {/* Input Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="contoh@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            {/* Input NIK */}
            <Text style={styles.label}>No NIK</Text>
            <TextInput
                style={styles.input}
                placeholder="32xxxxxxxxxxxxxx"
                value={noNIK}
                onChangeText={setNoNIK}
                keyboardType="numeric"
            />

            {/* Input Address */}
            <Text style={styles.label}>Alamat Lengkap</Text>
            <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Masukkan alamat lengkap Anda"
                value={address}
                onChangeText={setAddress}
                multiline
            />

            {/* Checkbox Terms */}
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsAgreed(!isAgreed)}
            >
                <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>
                    Saya setuju dengan
                    <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}> Syarat & Ketentuan</Text> yang berlaku.
                </Text>
            </TouchableOpacity>

            {/* Checkbox Fee */}
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsAgreedFee(!isAgreedFee)}
            >
                <View style={[styles.checkbox, isAgreedFee && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>
                    Saya setuju membayar uang keanggotaan koperasi sebesar{' '}
                    <Text style={{ fontWeight: 'bold', color: '#2563eb' }}>
                        Rp {rekening.toLocaleString('id-ID')}
                    </Text> per tahun.
                </Text>
            </TouchableOpacity>

            <Text style={styles.note}>
                Dengan mendaftar, Anda secara otomatis akan melakukan pembayaran uang keanggotaan tahunan koperasi.
            </Text>

            {/* Button */}
            <TouchableOpacity
                style={[styles.button, (!isAgreed || !isAgreedFee || loading) && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={!isAgreed || !isAgreedFee || loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                </Text>
            </TouchableOpacity>

            {/* Modal Syarat & Ketentuan */}
            <Modal visible={showTermsModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Syarat & Ketentuan</Text>
                        <ScrollView style={{ maxHeight: 400 }}>
                            <Text style={styles.modalHeading}>{terms.title}</Text>
                            {terms.content.map((item, index) => (
                                <Text key={index} style={styles.modalText}>
                                    {index + 1}. {item}{"\n"}
                                </Text>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setShowTermsModal(false)}
                        >
                            <Text style={styles.modalBtnText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Konfirmasi */}
            <Modal visible={showConfirmModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Konfirmasi Pendaftaran</Text>
                        <Text style={styles.modalText}>
                            Apakah Anda yakin data yang dimasukkan sudah benar dan ingin melanjutkan pendaftaran?
                        </Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={confirmRegister}>
                            <Text style={styles.modalBtnText}>Ya, Lanjutkan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalBtn, { backgroundColor: '#9ca3af', marginTop: 8 }]}
                            onPress={() => setShowConfirmModal(false)}
                        >
                            <Text style={styles.modalBtnText}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 12 },
    input: {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
        padding: 10, backgroundColor: '#fff', marginTop: 4
    },
    checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
    checkbox: {
        width: 20, height: 20, borderWidth: 1, borderColor: '#9ca3af',
        marginRight: 10, borderRadius: 4, backgroundColor: '#fff'
    },
    checkboxChecked: { backgroundColor: '#2563eb' },
    checkboxLabel: { flex: 1, fontSize: 13, color: '#374151' },
    linkText: { color: '#2563eb', fontWeight: '600' },
    note: { fontSize: 12, fontStyle: 'italic', color: '#6b7280', marginTop: 8 },
    button: {
        marginTop: 20, backgroundColor: '#2563eb', paddingVertical: 14,
        borderRadius: 8, alignItems: 'center'
    },
    buttonDisabled: { backgroundColor: '#9ca3af' },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center',
        justifyContent: 'center', padding: 16
    },
    modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    modalText: { fontSize: 14, color: '#374151', marginBottom: 16, textAlign: 'center' },
    modalBtn: {
        backgroundColor: '#2563eb', paddingVertical: 10, borderRadius: 8, alignItems: 'center'
    },
    modalBtnText: { color: '#fff', fontWeight: '600' },
});
