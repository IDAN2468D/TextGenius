import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Authentication/SplashScreen'; 
import GeminiAITabs from '../navigation/GeminiAITabs'; 
import { LogInScreen, RegisterScreen } from '../screens/Authentication';
import ForgetPassword from '../screens/Authentication/ForgetPassword';

const Stack = createNativeStackNavigator();

export function  RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false}} />
      <Stack.Screen name="LogIn" component={LogInScreen} options={{ headerShown: false,animation: "fade_from_bottom"  }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false,animation: "fade_from_bottom"  }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false,animation: "fade_from_bottom" }} />
      <Stack.Screen name="Home" component={GeminiAITabs} options={{ headerShown: false,animation: "fade_from_bottom"  }} />
    </Stack.Navigator>
  );
}
