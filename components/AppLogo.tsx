// components/AppLogo.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logocarrinho.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
