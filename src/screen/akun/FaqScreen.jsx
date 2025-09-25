// screen/akun/FaqScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const faqData = [
  {
    question: 'Bagaimana cara mendaftar akun?',
    answer: 'Cukup masukkan nomor ponsel Anda. Sistem akan otomatis mengenali apakah nomor tersebut perlu mendaftar atau sudah terdaftar. Verifikasi dilakukan melalui kode OTP WhatsApp.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Kami menggunakan enkripsi dan standar keamanan tinggi untuk melindungi data pribadi Anda.',
  },
  {
    question: 'Apakah aplikasi ini gratis?',
    answer: 'Ya, aplikasi ini gratis digunakan. Namun, beberapa fitur hanya bisa diakses jika Anda terdaftar sebagai anggota koperasi.',
  },
  {
    question: 'Bagaimana cara top up saldo?',
    answer: 'Klik tombol "Top Up", masukkan jumlah yang ingin ditambahkan, lalu unggah bukti pembayaran. Sistem akan otomatis mengenali bukti tersebut.',
  },
  {
    question: 'Bagaimana cara melihat transaksi saya sebelumnya?',
    answer: 'Buka menu "Top Up". Di sana akan tampil daftar riwayat transaksi Anda.',
  },
  {
    question: 'Bagaimana cara update saldo?',
    answer: 'Jika saldo tidak otomatis ter-update, cukup klik tampilan saldo Anda. Sistem akan memuat ulang saldo secara otomatis.',
  },
  {
    question: 'Bagaimana membeli aset patungan?',
    answer: 'Klik tombol "Patungan" atau "Promo Patungan". Anda bisa melihat detail aset legal, syarat & ketentuan, serta daftar peserta.',
  },
  {
    question: 'Bagaimana cara melihat aset yang sudah dibeli?',
    answer: 'Masuk ke menu "Asetku". Semua aset yang sudah Anda beli akan tampil di sana, termasuk daftar pesertanya.',
  },
  {
    question: 'Bagaimana membeli aset arisan emas?',
    answer: 'Klik tombol "Arisan" atau "Promo Arisan". Anda bisa melihat detail aset legal, syarat & ketentuan, serta daftar peserta.',
  },
  {
    question: 'Bagaimana membayar iuran tahunan koperasi?',
    answer: 'Jika iuran tahunan belum dibayar, beberapa menu akan otomatis tertutup. Silakan klik tombol "Daftar Ulang". Saldo Anda akan terpotong sesuai jumlah iuran koperasi.',
  },
  {
    question: 'Bagaimana membayar iuran bulanan koperasi?',
    answer: 'Buka menu "Koperasi". Tersedia tombol khusus untuk membayar iuran bulanan, saldo Anda akan otomatis terpotong sesuai jumlah iuran.',
  },
  {
    question: 'Bagaimana saya menghapus akun?',
    answer: 'Kamu tinggal masuk ke menu "Akun", lalu pilih "Hapus Akun". Semua data termasuk saldo, riwayat transaksi, asset properti, dan akun yang sudah pernah dicantumkan di aplikasi akan ikut terhapus.',
  },
];


const FaqScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleExpand = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>

      {faqData.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <View
            key={index}
            style={{
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: '#f9fafb',
              borderWidth: 1,
              borderColor: '#e5e7eb',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111', flex: 1 }}>
                {item.question}
              </Text>
              {isOpen ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {/* Answer */}
            {isOpen && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>
                  {item.answer}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FaqScreen;
