import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { RootStackParamList } from '../types/StackScreen';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const { deleteUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 
  
  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      navigation.navigate('LogIn');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleDeleteUser}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
