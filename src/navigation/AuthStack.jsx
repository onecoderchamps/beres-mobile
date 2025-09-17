// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screen/auth/AuthScreen';
import OtpVerificationScreen from '../screen/auth/OtpVerificationScreen';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const Stack = createNativeStackNavigator();

const AuthStack = ({ onDone }) => {
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
      })}>
      <Stack.Screen name="LoginScreen" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OtpScreen" options={{ headerShown: true, title: "" }} component={(props) => (
        <OtpVerificationScreen
          {...props}
          onDone={onDone} // refresh onboarding + token
        />
      )} />
    </Stack.Navigator>
  );
};

export default AuthStack;
