// app/index.tsx
//ajustadinho
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen    from './screens/LoginScreen';
import HomeScreen     from './screens/HomeScreen';
import AdminNavigator from './screens/admin/AdminNavigator';
import { User }       from './service/api';
import SplashScreen   from './SplashScreen';
import { Palette }     from '../constants/theme';

export default function Index() {
  const [user, setUser]             = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timeout);
  }, []);

  // 🔵 Splash animado primeiro
  if (showSplash) return <SplashScreen />;

  // ── Roteamento por apartamento ────────────────────────────────────────────
  // ap. 000 = admin  |  ap. 999 = portaria  |  outros = morador
  const isAdmin     = user?.apartment === '000';
  const isPortaria  = user?.apartment === '999';
  const isGerencial = isAdmin || isPortaria;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />

      {!user && (
        <LoginScreen onLogin={setUser} />
      )}

      {user && isGerencial && (
        <AdminNavigator
          role={isAdmin ? 'admin' : 'portaria'}
          onLogout={() => setUser(null)}
        />
      )}

      {user && !isGerencial && (
        <HomeScreen user={user} onLogout={() => setUser(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
});