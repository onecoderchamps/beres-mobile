import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { X, Play, FileText, Edit3 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// Warna badge berdasarkan tipe materi
const badgeColor = {
    video: '#dc2626', // merah
    pdf: '#2563eb',   // biru
    text: '#16a34a',  // hijau
};

// Data edukasi
const edukasiData = [
    {
        id: '1',
        title: 'STRATEGI PERCEPATAN BISNIS',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852eda6692de1f78365b8de',
        sourceBy: 'By Dudi Suparhadi',
        source: `
1️⃣
1.BERES-INVESTOR-KOMUNITAS 
2.BERES-INVESTOR-BANK
3.BERES-INVESTOR-DEBITUR
2️⃣
STRATEGI BRANDING :
1.ATM CO-BRANDING 
2.BACK TO BACK DEPOSITO,EMAS,CC
3.PLATFORM
3️⃣
STRATEGI BISNIS :
1.SEMINAR BERES DI KAMPUS
2.SEMINAR BERES DI KOMUNITAS 
3.SEMINAR BERES DI INSTANSI,DLL
4️⃣
STRATEGI CLOSING 
1.SEMINAR NPL REVOLUTION 
2.WORKSHOP NPL REVOLUTION 
3.MEMBERSHIP BERES
5️⃣
STRATEGI KOMISI
1.KOMISI SEMINAR 10%
2.KOMISI WORKSHOP 10%
3.KOMISI PENJUALAN ASET BERES 5%
6️⃣
TEAM INTI BERES :
1.TEAM MODAL
2.TEAM BISNIS
3.TEAM ASSET
7️⃣
TEAM MARKETING 
1.DUDI
2.INVESTOR
3.KOMUNITAS
8️⃣
STRATEGI UMADHATU 
1.KAMPUNG INGGRIS 
2.VILLA GRATIS MOTOR PCX/VARIO
3.RENTAL VILLA DAN BUYBACK VILLA*
9️⃣
STRATEGI MUSTIKA ESTATE 
1.DISKON PROPERTI 
2.HADIAH EMAS LM
3.HADIAH MOTOR ATAU MOBIL/RUMAH
🔟
1.KOPDAR
2.TRAVELING
3.MAKAN-MAKAN`,
    },
    {
        id: '2',
        title: 'Investasi Rumah Tanpa Modal',
        type: 'video',
        thumbnail: 'https://img.youtube.com/vi/75LvJLlCJnY/hqdefault.jpg',
        sourceBy: 'By Kasisolusi',
        source: 'https://youtu.be/75LvJLlCJnY?si=XBkUmc-t7okgSYsU',
    },
    {
        id: '3',
        title: 'Yuk Mengenal BERES',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852ed9e692de1f78365b8dc',
        sourceBy: 'By Dudi Suparhadi',
        source: `
Bukan hanya sekedar kata,tapi juga Jargon,Semangat dan Doa,yg akan membuat sesuatu dari yg tidak beres menjadi BERES

Beres terdiri dari 5 huruf :
Beli
Emas
Rumah/Ruko/Resort 
Edukasi 
Sedekah/Sharing

Semoga BERES menjadi Motivasi dan Bahan bakar untuk percepatan menjadi sukses dan kaya dengan strategi dan cara :
BELI ( bukan utang,andaikan terpaksa utang,biarkan orang lain yg utang ke bank,bank nya bayar ke kita cash.
Andaikan terpaksa utang,amankan dengan management ⅓).

EMAS
(Semua bisa memulai langkah kecil dg strategi Arisan dan Patungan emas untuk membeli aset properti/rumah/ruko,aset produktif)

RUMAH
Rumah/Ruko/Resort/aset kita beli secara cash dengan sistem Arisan atau Patungan 

EDUKASI
Sebagai strategi dan cara untuk menjalankan sistem bisnis beres secara nasional bahkan internasional 

SEDEKAH/SHARING
Sedekah/Sharing sebagai semangat,bahwa kita punya kewajiban berbagi ilmu,berbagi pengalaman,berbagi uang,berbagi bantuan yg bermanfaat,agar saudara2 kita yg belum sukses dan kaya,bisa berubah kehidupannya menjadi lebih baik lagi.

Ciputat,Indonesia 17-8-2024
#Original Dudi patunganproperti 
#BERESin Indonesia,Indonesia BERES.`,
    },
    {
        id: '4',
        title: '3 GRAND DESIGN BERES',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852eda6692de1f78365b8de',
        sourceBy: 'By Dudi Suparhadi',
        source: `3 GRAND DESIGN BERES
1️⃣ MODAL :
-INVESTOR 
-KOPERASI
-BANK
-SPONSOR 
-LAIN-LAIN

2️⃣ BISNIS :
-SEMINAR
-E-BOOK
-JASA
-EDUKASI
-DEVELOPER 

3️⃣ ASSET (for printing the money) :
-NPL
-RUMAH
-RUKO
-HOTEL
-VILLA

Apapun itu,kuncinya kuasai 3 ini :
1.Modal
Darimana modalnya ?
Modal yg aman dan terukur,bisa sistem apapun,yg penting saling untung menguntungkan agar berkah.

2.Bisnis
Bisnis apa yg modalnya relatif kecil bahkan tanpa modal.
Bisnis yg benar-benar kita jiwai,nikmati,dan sesuai passion kita.

Asset
Asset apa yg bisa di bangun bisnis di atas aset tsb.
(Istilahnya asset produktif dan punya cashflow)

Kalau kita sdh punya 3 sumber ini,sy yakin kita semua bisa sukses dan kaya,insya Allaah.

Inilah sinergi segitiga emas Beres.

#Original Dudi patunganproperti
#Semua akan BERES pada waktunya 
#Beres,memudahkan dan menguntungkan
Bukit indah,1 juni 2025
Masjid Jabal Nur.`,
    },
];

// Fungsi embed YouTube
function getYouTubeEmbedUrl(url) {
    try {
        if (url.includes('youtu.be')) {
            const id = url.split('/').pop().split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('youtube.com')) {
            const id = new URL(url).searchParams.get('v');
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    } catch {
        return url;
    }
}

const EdukasiScreen = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const renderBadgeIcon = (type) => {
        if (type === 'video') return <Play size={14} color="white" />;
        if (type === 'pdf') return <FileText size={14} color="white" />;
        if (type === 'text') return <Edit3 size={14} color="white" />;
        return null;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedItem(item)}
            activeOpacity={0.8}
        >
            {/* Thumbnail */}
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

            {/* Badge */}
            <View style={[styles.badge, { backgroundColor: badgeColor[item.type] }]}>
                {renderBadgeIcon(item.type)}
                <Text style={styles.badgeText}>{item.type}</Text>
            </View>

            {/* Konten */}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.cardSource}>{item.sourceBy}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ padding: 16, borderColor: '#eee' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
                    Edukasi
                </Text>
            </View>

            <FlatList
                data={edukasiData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            />

            {/* Modal */}
            <Modal
                visible={!!selectedItem}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedItem(null)}
            >
                <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedItem(null)}>
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {/* Konten */}
                        <ScrollView style={{ flex: 1 }}>
                            {selectedItem?.type === 'video' && (
                                <View style={styles.videoContainer}>
                                    <WebView
                                        source={{ uri: getYouTubeEmbedUrl(selectedItem.source) }}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            )}

                            {selectedItem?.type === 'pdf' && (
                                <View style={{ height: 400 }}>
                                    <WebView source={{ uri: selectedItem.source }} style={{ flex: 1 }} />
                                </View>
                            )}

                            {selectedItem?.type === 'text' && (
                                <View style={styles.textContainer}>
                                    <Text style={styles.textContent}>{selectedItem.source}</Text>
                                </View>
                            )}

                            <Text style={styles.sourceFooter}>
                                Sumber: <Text style={{ fontWeight: '600' }}>{selectedItem?.sourceBy}</Text>
                            </Text>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        width: (width - 48) / 2, // 16px padding kiri kanan + 16px jarak antar
        elevation: 3,
    },
    thumbnail: {
        width: '100%',
        height: 120,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
        textTransform: 'capitalize',
    },
    cardContent: {
        padding: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    cardSource: {
        fontSize: 12,
        color: '#6b7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        flex: 1,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    videoContainer: {
        height: 220,
        borderRadius: 8,
        overflow: 'hidden',
        margin: 12,
    },
    textContainer: {
        padding: 16,
    },
    textContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#374151',
    },
    sourceFooter: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'right',
        margin: 12,
    },
});

export default EdukasiScreen;
