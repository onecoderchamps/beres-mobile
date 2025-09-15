// screen/akun/FaqScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const faqData = [
  {
    question: 'Bagaimana cara mendaftar akun?',
    answer: 'Anda dapat mendaftar dengan mengisi form registrasi menggunakan email atau nomor HP, lalu verifikasi kode OTP.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Kami menggunakan enkripsi dan standar keamanan tinggi untuk melindungi data pribadi Anda.',
  },
  {
    question: 'Bagaimana cara mengubah password?',
    answer: 'Masuk ke menu Akun > Keamanan Akun > Ubah Password, lalu ikuti langkah yang tersedia.',
  },
  {
    question: 'Apakah aplikasi ini gratis?',
    answer: 'Ya, aplikasi ini dapat digunakan secara gratis. Namun beberapa fitur premium mungkin berbayar.',
  },
];

const FaqScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleExpand = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>

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
