import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    View,
} from 'react-native';

export default function SplashScreen() {
  const cartX = useRef(new Animated.Value(-120)).current;
  const keyX = useRef(new Animated.Value(120)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const iconsOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // anima carrinho e chave se aproximando
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cartX, {
          toValue: -20,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(keyX, {
          toValue: 20,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // dá uma “encostadinha”
      Animated.parallel([
        Animated.timing(cartX, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(keyX, {
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      // some com os ícones e aparece a logo
      Animated.parallel([
        Animated.timing(iconsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [cartX, keyX, logoOpacity, iconsOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconsRow, { opacity: iconsOpacity }]}>
        <Animated.View style={{ transform: [{ translateX: cartX }] }}>
          <MaterialCommunityIcons name="cart-outline" size={56} color="#ffffff" />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateX: keyX }] }}>
          <MaterialCommunityIcons name="key-variant" size={56} color="#ffffff" />
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ opacity: logoOpacity, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/logocarrinho.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001a33', // azul escuro
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
  },
});
