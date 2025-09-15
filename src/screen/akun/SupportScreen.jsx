// screen/akun/SupportScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { ChevronDown, ChevronUp, LifeBuoy, MessageCircle } from 'lucide-react-native';

const helpData = [
  {
    category: 'Akun',
    faqs: [
      { q: 'Bagaimana cara mengganti password?', a: 'Masuk ke menu Akun > Keamanan Akun > Ubah Password.' },
      { q: 'Saya lupa password, apa yang harus dilakukan?', a: 'Gunakan fitur Lupa Password pada halaman login dan ikuti instruksi.' },
    ],
  },
  {
    category: 'Transaksi',
    faqs: [
      { q: 'Apakah ada biaya transaksi?', a: 'Untuk sebagian besar fitur gratis, namun ada biaya layanan tertentu yang akan ditampilkan sebelum konfirmasi.' },
      { q: 'Berapa lama proses verifikasi pembayaran?', a: 'Proses biasanya selesai dalam 1-5 menit. Jika lebih lama, hubungi tim support.' },
    ],
  },
  {
    category: 'Keamanan',
    faqs: [
      { q: 'Apakah data saya aman?', a: 'Ya, kami menggunakan enkripsi dan standar keamanan terbaik untuk melindungi data Anda.' },
      { q: 'Bagaimana jika akun saya diretas?', a: 'Segera ubah password dan hubungi tim support melalui email bantuan resmi.' },
    ],
  },
];

const SupportScreen = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
    setActiveFaq(null);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContact = async () => {
    const whatsappUrl = 'https://wa.me/6285817287523?text=Halo%20saya%20butuh%20bantuan'; // ganti nomor WA
    const emailUrl = 'mailto:support@aplikasi.com?subject=Butuh Bantuan&body=Halo%20tim%20support,'; 

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(emailUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak dapat membuka aplikasi komunikasi.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {/* LIST FAQ */}
      {helpData.map((section, catIndex) => {
        const isCategoryOpen = activeCategory === catIndex;
        return (
          <View
            key={catIndex}
            style={{
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: '#f9fafb',
              borderWidth: 1,
              borderColor: '#e5e7eb',
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={() => toggleCategory(catIndex)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>
                {section.category}
              </Text>
              {isCategoryOpen ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {isCategoryOpen &&
              section.faqs.map((faq, faqIndex) => {
                const isFaqOpen = activeFaq === faqIndex;
                return (
                  <View key={faqIndex} style={{ borderTopWidth: 1, borderColor: '#e5e7eb' }}>
                    <TouchableOpacity
                      onPress={() => toggleFaq(faqIndex)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 14,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: '#111', flex: 1 }}>{faq.q}</Text>
                      {isFaqOpen ? (
                        <ChevronUp size={18} color="#9ca3af" />
                      ) : (
                        <ChevronDown size={18} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                    {isFaqOpen && (
                      <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                        <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>
                          {faq.a}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        );
      })}

      {/* HUBUNGI KAMI */}
      <TouchableOpacity
        onPress={handleContact}
        style={{
          marginTop: 20,
          backgroundColor: '#9333ea',
          borderRadius: 12,
          paddingVertical: 14,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 2,
        }}
      >
        <MessageCircle size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Hubungi Kami</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SupportScreen;
