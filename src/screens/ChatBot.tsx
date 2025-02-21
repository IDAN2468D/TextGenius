import React, { useState } from 'react';
import { Text, TextInput, View, Button, ScrollView } from 'react-native';
import { useChat } from '../hooks/useChat';
import { ButtonText } from '../components';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

const ChatBot: React.FC = () => {
  const { state, handleSend, setMessage, message, animatedTextStyle, animatedBorderStyle } = useChat();

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-4">
        {state.conversation.map((chat: ChatMessage, index: number) => (
          <Text
            key={index}
            className={`p-2 my-1 rounded-lg ${
              chat.role === 'user' ? 'bg-green-200 self-end' : 'bg-red-200 self-start'
            } ${animatedTextStyle}`}
          >
            {chat.content}
          </Text>
        ))}
      </ScrollView>

      {state.error && <Text className="text-red-500 mb-2 text-center">{state.error}</Text>}
      <View className="flex-row items-center">
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        className={`flex-1 h-12 border-2 border-gray-300 rounded-lg px-4 py-2 mr-2 text-lg ${animatedBorderStyle}`}
      />
      <ButtonText title="Send" onPress={handleSend} disabled={state.loading} />
      </View>
    </View>
  );
};

export default ChatBot;