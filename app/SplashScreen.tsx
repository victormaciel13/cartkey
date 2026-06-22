// app/SplashScreen.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Palette, FontSize, FontWeight, Spacing } from '../constants/theme';

export default function SplashScreen() {
  const cartX = useRef(new Animated.Value(-120)).current;
  const keyX = useRef(new Animated.Value(120)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const iconsOpacity = useRef(new Animated.Value(1)).current;
  const wordmarkY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cartX, { toValue: -22, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(keyX, { toValue: 22, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cartX, { toValue: -10, duration: 150, useNativeDriver: true }),
        Animated.timing(keyX, { toValue: 10, duration: 150, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(iconsOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(wordmarkY, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  }, [cartX, keyX, logoOpacity, iconsOpacity, wordmarkY]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconsRow, { opacity: iconsOpacity }]}>
        <Animated.View style={{ transform: [{ translateX: cartX }] }}>
          <MaterialCommunityIcons name="cart-outline" size={56} color={Palette.primary} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: keyX }] }}>
          <MaterialCommunityIcons name="key-variant" size={56} color={Palette.white} />
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ opacity: logoOpacity, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/logocarrinho.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo do CartKey"
        />
        <Animated.View style={{ transform: [{ translateY: wordmarkY }] }}>
          <Text style={styles.wordmark}>
            Cart<Text style={styles.wordmarkAccent}>Key</Text>
          </Text>
          <Text style={styles.tagline}>Carrinhos do condomínio, na palma da mão</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsRow: { flexDirection: 'row', marginBottom: Spacing.md },
  logo: { width: 120, height: 120, marginBottom: Spacing.sm },
  wordmark: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Palette.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  wordmarkAccent: { color: Palette.primary },
  tagline: {
    fontSize: FontSize.sm,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});