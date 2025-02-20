import React from "react";
import { Text, TextInput, Button, ActivityIndicator, Image, View, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useMultimodalForm } from "../hooks/useMultimodalForm";

const MultimodalFormScreen = () => {
    const {
        text,
        imageUri,
        loading,
        error,
        result,
        handleTextChange,
        handleSubmit,
        handleImageSelection
    } = useMultimodalForm();

    const [scale] = React.useState(new Animated.Value(1)); 

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
                    Multimodal Form
                </Text>

                {/* שדה טקסט */}
                <TextInput
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl shadow-lg mb-6 text-lg"
                    placeholder="Enter text here"
                    value={text}
                    onChangeText={handleTextChange}
                />

                {/* כפתור בחירת תמונה */}
                <TouchableOpacity
                    onPressIn={handleButtonPress} // כאשר לוחצים
                    onPressOut={handleButtonRelease} // כאשר משחררים
                    onPress={handleImageSelection}
                    activeOpacity={0.7}
                >
                    <Animated.View
                        style={[{ transform: [{ scale }] }, { backgroundColor: '#4CAF50' }]} // צבע ירוק
                        className="py-4 px-12 rounded-full mb-6 shadow-xl"
                    >
                        <Text className="text-white text-xl font-semibold">Select Image</Text>
                    </Animated.View>
                </TouchableOpacity>

                {/* הצגת התמונה הנבחרת */}
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-64 rounded-xl mb-6 border-2 border-gray-300 shadow-lg"          
                        resizeMode="cover"
                    />
                )}

                {/* כפתור שליחה */}
                <TouchableOpacity
                    onPressIn={handleButtonPress} // כאשר לוחצים
                    onPressOut={handleButtonRelease} // כאשר משחררים
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <Animated.View
                        style={[{ transform: [{ scale }] }, { backgroundColor: '#1D4ED8' }]} // צבע כחול
                        className={`py-4 px-12 rounded-full mb-6 shadow-xl ${loading ? 'opacity-50' : ''}`}
                    >
                        <Text className="text-white text-xl font-semibold">Submit</Text>
                    </Animated.View>
                </TouchableOpacity>

                {/* מעגל טעינה */}
                {loading && <ActivityIndicator size="large" color="#1D4ED8" className="mt-4" />}

                {/* הצגת שגיאה */}
                {error && (
                    <Text className="text-red-500 mt-4 text-center text-xl font-semibold">
                        {error}
                    </Text>
                )}

                {/* הצגת תוצאה */}
                {result && (
                    <View className="mt-6 p-4 bg-green-100 rounded-lg shadow-md">
                        <Text className="text-lg font-semibold text-green-700">
                            תוצאה: {result}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default MultimodalFormScreen;
