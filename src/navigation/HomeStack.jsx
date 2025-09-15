// navigation/HomeStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Briefcase, User, Book } from 'lucide-react-native';

// Screens utama
import HomeScreen from '../screen/home/HomeScreen';
import AssetkuScreen from '../screen/home/AssetkuScreen';
import AkunScreen from '../screen/home/AkunScreen';
import EdukasiScreen from '../screen/home/EdukasiScreen';

// Screens tambahan (global)
import FaqScreen from '../screen/akun/FaqScreen';
import SupportScreen from '../screen/akun/SupportScreen';
import SecurityScreen from '../screen/akun/SecurityScreen';
import AboutScreen from '../screen/akun/AboutScreen';
import ChatAI from '../screen/feature/ChatAI';
import PatunganDetail from '../screen/patungan/PatunganDetail';
import SaldoScreen from '../screen/feature/SaldoScreen'; // ✅ ganti

import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🔹 Tab Bottom Navigation
const BottomTabs = ({ onDone }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') return <Home size={20} color={color} />;
          if (route.name === 'AssetKu') return <Briefcase size={20} color={color} />;
          if (route.name === 'Akun') return <User size={20} color={color} />;
          if (route.name === 'Edukasi') return <Book size={20} color={color} />;
        },
        tabBarActiveTintColor: '#facc15',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AssetKu" component={AssetkuScreen} />
      <Tab.Screen name="Edukasi" component={EdukasiScreen} />
      <Tab.Screen name="Akun">
        {(props) => <AkunScreen {...props} onDone={onDone} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// 🔹 Stack Utama
const HomeStack = ({ onDone }) => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleStyle: { color: '#000' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 12 }}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        ),
      })}
    >
      {/* Tab sebagai halaman utama */}
      <Stack.Screen
        name="MainTabs" // ✅ diganti biar tidak bentrok
        options={{ headerShown: false }}
      >
        {(props) => <BottomTabs {...props} onDone={onDone} />}
      </Stack.Screen>

      {/* Screen tambahan */}
      <Stack.Screen name="ChatScreen" component={ChatAI} options={{ title: 'Beres AI' }} />
      <Stack.Screen name="PatunganDetail" component={PatunganDetail} options={{ title: 'Patungan' }} />
      <Stack.Screen name="SaldoScreen" component={SaldoScreen} options={{ title: 'TopUp' }} />
      <Stack.Screen name="FaqScreen" component={FaqScreen} options={{ title: 'Pertanyaan Umum' }} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} options={{ title: 'Pusat Bantuan' }} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} options={{ title: 'Keamanan Akun' }} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ title: 'Tentang Aplikasi' }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
