import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const StyledButton: React.FC<ButtonProps> = ({ title, onPress, disabled = false }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Text className="text-center">{title}</Text>
  </TouchableOpacity>
);

export default StyledButton;