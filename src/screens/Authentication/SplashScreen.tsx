import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/StackScreen';
import LottieView from 'lottie-react-native';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000, 
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('LogIn');
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="black"/>
      <AnimatedLottieView
        source={require('../../Lottie/Animation.json')}
        progress={animationProgress.current}
        style={styles.lottie}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
