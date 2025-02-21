import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import useLoginForm from '../../hooks/useLoginForm';

const LoginScreen = ({ navigation }: any) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    passwordSecureText,
    togglePasswordVisibility,
    handleLogin,
    emailError,
    passwordError,
    error,
    loading,
  } = useLoginForm();

  console.log('emailError', error);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6">
      <Text className="text-4xl font-bold text-white mb-4">Text Genius</Text>
      <Text className="text-lg text-gray-400 mb-8">Welcome back! Let's get you signed in.</Text>

      {/* Email Input */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-4"
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      {/* Email Error Message */}
      {emailError && <Text className="text-red-500 text-sm mb-4">{emailError}</Text>}

      {/* Password Input */}
      <View className="relative w-full mb-4">
        <TextInput
          className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base pl-4"
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry={passwordSecureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="absolute left-4 top-3"
          onPress={() => togglePasswordVisibility('password')}
        >
          <Icon
            name={passwordSecureText ? 'eye-off' : 'eye'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Password Error Message */}
      {passwordError && <Text className="text-red-500 text-sm mb-4">{passwordError}</Text>}

      {/* Sign In Button */}
      <TouchableOpacity
        className="w-full h-12 bg-green-600 rounded-lg justify-center items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white font-bold text-lg">{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>

      {/* Forgot Password and Register Links */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text className="text-blue-400 underline text-sm">Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-4">
        <Text className="text-blue-400 underline text-sm">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
