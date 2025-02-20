import React, { useState } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import useGeminiAI from '../hooks/useGeminiAI';

const GeminiAIImage = () => {
    const { state, handleImageChange, handleImageAnalysis } = useGeminiAI();
    const [scale] = useState(new Animated.Value(1));

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                handleImageChange(selectedImage);
            } else {
                console.error('No image selected or user cancelled.');
            }
        });
    };

    const handleButtonPress = () => {
        Animated.spring(scale, {
            toValue: 1.1, 
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handleButtonRelease = () => {
        Animated.spring(scale, {
            toValue: 1, 
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-100">
            <View className="flex-1 p-6">
                <Text className="text-3xl font-extrabold text-center text-purple-600 mb-6">Gemini AI Image Analysis</Text>
                <Text className="text-lg text-center text-gray-600 mb-8">Pick an image to analyze and get insights!</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPressIn={handleButtonPress} 
                    onPressOut={handleButtonRelease} 
                    onPress={selectImage}
                >
                    <Animated.View
                        style={[{ transform: [{ scale }] }, { backgroundColor: '#6B21A8' }]} 
                        className="py-4 px-12 rounded-full mb-6 shadow-xl"
                    >
                        <Text className="text-white text-xl font-semibold">Pick an Image</Text>
                    </Animated.View>
                </TouchableOpacity>
                {state.image && (
                    <Image
                        source={{ uri: state.image.uri }}
                        className="w-full h-56 rounded-xl mb-6 shadow-lg"
                    />
                )}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPressIn={handleButtonPress} 
                    onPressOut={handleButtonRelease} 
                    onPress={handleImageAnalysis}
                    disabled={!state.image}
                >
                    <Animated.View
                        style={[{ transform: [{ scale }] }, { backgroundColor: '#6B21A8' }]}
                        className={`py-4 px-12 rounded-full mb-6 shadow-xl ${!state.image ? 'opacity-50' : ''}`}
                    >
                        <Text className="text-white text-xl font-semibold">Analyze Image</Text>
                    </Animated.View>
                </TouchableOpacity>
                {state.imageAnalysis && (
                    <View className="bg-white p-5 rounded-lg shadow-lg mt-6">
                        <Text className="text-xl font-semibold text-purple-700 mb-3">Analysis Results:</Text>
                        <Text className="text-base text-gray-700">{state.imageAnalysis}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default GeminiAIImage;