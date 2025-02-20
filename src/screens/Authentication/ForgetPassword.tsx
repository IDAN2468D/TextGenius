import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import useForgetPassword from '../../hooks/useForgetPassword';

const ForgetPasswordScreen = ({ navigation }: any) => {
  const { email, oldPassword, newPassword, emailError, oldPasswordError, newPasswordError, isLoading, setEmail, setOldPassword, setNewPassword, handleForgetPassword } = useForgetPassword();

  const handleResetPassword = async () => {
    try {
      await handleForgetPassword(); 
    } catch (error) {
      console.error('Error during password reset:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6">
      <Text className="text-4xl font-bold text-white mb-4">Reset Password</Text>
      <Text className="text-lg text-gray-400 mb-8">Enter your email to reset your password.</Text>

      {/* Email Input */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-2"
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text className="text-red-500 text-sm mb-4">{emailError}</Text> : null}

      {/* Old Password Input */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-2"
        placeholder="Enter old password"
        placeholderTextColor="#888"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      {oldPasswordError ? <Text className="text-red-500 text-sm mb-4">{oldPasswordError}</Text> : null}

      {/* New Password Input */}
      <TextInput
        className="w-full h-12 bg-gray-800 rounded-lg px-4 text-white text-base mb-2"
        placeholder="Enter new password"
        placeholderTextColor="#888"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      {newPasswordError ? <Text className="text-red-500 text-sm mb-4">{newPasswordError}</Text> : null}

      {/* Send Reset Button */}
      <TouchableOpacity
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center"
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Send Reset Email</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
        <Text className="text-blue-400 underline text-sm mt-4">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPasswordScreen;