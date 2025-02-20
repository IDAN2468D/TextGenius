import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GeminiAIText from '../screens/GeminiAIText';  
import GeminiAIImage from '../screens/GeminiAIImage';  
import MultimodalFormScreen from '../screens/MultimodalForm'; 
import ChatBot from '../screens/ChatBot'; 
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function GeminiAITabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
          borderTopWidth: 1,
          borderTopColor: '#e1e1e1',
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Text AI"
        component={GeminiAIText}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="filetext1" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Image AI"
        component={GeminiAIImage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="images" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Multimodal"
        component={MultimodalFormScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="image-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatBot"
        component={ChatBot}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="wechat" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
