// navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../OpeningSlider';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack'; // <-- Tambahkan import
import { SafeAreaView } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const checkInitialState = async () => {
    try {
      const seen = await AsyncStorage.getItem('seenOnboar');
      const token = await AsyncStorage.getItem('accessTokens');

      setHasSeenOnboarding(seen === 'true');
      setHasToken(!!token); // true jika token tidak null
    } catch (err) {
      console.log('Error checking onboarding or token:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkInitialState();
  }, []);

  if (isLoading) return null; // Optional: bisa ganti dengan splash screen

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={(props) => (
            <OnboardingScreen
              {...props}
              onDone={checkInitialState} // refresh onboarding + token
            />
          )}
        />
      ) : hasToken ? (
        <Stack.Screen name="HomeStack" component={(props) => (
            <HomeStack
              {...props}
              onDone={checkInitialState} // refresh onboarding + token
            />
          )}/>
      ) : (
        <Stack.Screen name="AuthStack" component={(props) => (
            <AuthStack
              {...props}
              onDone={checkInitialState} // refresh onboarding + token
            />
          )} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
