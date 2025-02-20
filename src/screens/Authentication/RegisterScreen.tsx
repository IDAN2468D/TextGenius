import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons
import useRegisterForm from '../../hooks/useRegisterForm';

const RegisterScreen = ({ navigation }: any) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    passwordSecureText,
    confirmPasswordSecureText,
    emailError,
    passwordError,
    confirmPasswordError,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleRegister,
  } = useRegisterForm();

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6">
      {/* Title */}
      <Text className="text-4xl font-bold text-white mb-4">Text Genius</Text>
      <Text className="text-lg text-gray-400 mb-8">Create a new account.</Text>

      {/* Username Input Field */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-4"
        placeholder="Enter your username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email Input Field */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-4"
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {emailError && <Text className="text-red-500 text-sm mb-2">{emailError}</Text>}

      {/* Password Input Field */}
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
      {passwordError && <Text className="text-red-500 text-sm mb-2">{passwordError}</Text>}

      {/* Confirm Password Input Field */}
      <View className="relative w-full mb-4">
        <TextInput
          className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base pl-4"
          placeholder="Confirm your password"
          placeholderTextColor="#888"
          secureTextEntry={confirmPasswordSecureText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          className="absolute left-4 top-3"
          onPress={() => togglePasswordVisibility('confirmPassword')}
        >
          <Icon
            name={confirmPasswordSecureText ? 'eye-off' : 'eye'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {confirmPasswordError && <Text className="text-red-500 text-sm mb-4">{confirmPasswordError}</Text>}

      {/* Register Button */}
      <TouchableOpacity
        className="w-full h-12 bg-green-600 rounded-lg justify-center items-center"
        onPress={handleRegister}
      >
        <Text className="text-white font-bold text-lg">Register</Text>
      </TouchableOpacity>

      {/* Link to Login for existing users */}
      <TouchableOpacity onPress={() => navigation.navigate('LogIn')} className="mt-4">
        <Text className="text-blue-400 underline text-sm">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
