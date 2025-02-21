import React from 'react';
import { View, TextInput, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import useGeminiAI from '../hooks/useGeminiAI';

const detectTextDirection = (text: string) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'rtl' : 'ltr';
};

const GeminiAIText = () => {
    const { state, handlePromptChange, handleSubmit } = useGeminiAI();
    const textDirection = detectTextDirection(state.prompt);

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-100">
            <View className="flex-1 p-6">
                <Text className="text-4xl font-bold text-center text-purple-800 mb-8">Ask Gemini AI</Text>
                <TextInput
                    className="h-16 border border-gray-400 rounded-lg mb-6 px-6 text-xl bg-white shadow-md focus:ring-4 focus:ring-purple-500 focus:border-purple-600"
                    placeholder="Enter your prompt here"
                    placeholderTextColor="#9CA3AF" 
                    value={state.prompt}
                    onChangeText={handlePromptChange}
                    style={{ textAlign: textDirection === 'rtl' ? 'right' : 'left' }}
                />
                {state.error && (
                    <Text className="text-red-600 text-center mb-4 text-base font-medium">
                        {state.error}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.85}
                    className="bg-purple-700 py-4 rounded-full shadow-lg"
                >
                    <Text className="text-white text-center font-bold text-lg tracking-wide">
                        Submit
                    </Text>
                </TouchableOpacity>
                {state.loading && (
                    <View className="flex items-center justify-center mt-8">
                        <ActivityIndicator size="large" color="#6B21A8" />
                        <Text className="text-lg text-gray-600 mt-3 font-medium">
                            Loading...
                        </Text>
                    </View>
                )}
                {state.response && (
                    <View className="mt-8 p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-300">
                        <Text
                            className={`font-bold text-2xl mb-4 text-purple-800 text-right`}
                        >
                            Response:
                        </Text>
                        <Text
                            className={`text-lg text-gray-800 leading-7 font-medium ${textDirection === 'ltr' ? 'text-right' : 'text-left'} ${textDirection === 'rtl' ? 'pr-4' : 'pl-4'}`}
                        >
                            {state.response}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default GeminiAIText;
