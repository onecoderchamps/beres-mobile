// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screen/auth/AuthScreen';
import OtpVerificationScreen from '../screen/auth/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

const AuthStack = ({ onDone }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={AuthScreen} />
      <Stack.Screen name="OtpScreen" component={(props) => (
        <OtpVerificationScreen
          {...props}
          onDone={onDone} // refresh onboarding + token
        />
      )} />
    </Stack.Navigator>
  );
};

export default AuthStack;
