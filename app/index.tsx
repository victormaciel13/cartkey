// app/index.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen    from './screens/LoginScreen';
import SignupScreen   from './screens/SignupScreen';
import HomeScreen     from './screens/HomeScreen';
import AdminNavigator from './screens/admin/AdminNavigator';
import SplashScreen   from './SplashScreen';
import { getCurrentUser, logout, User } from './service/api';
import { supabase } from './service/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Palette } from '../constants/theme';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Index() {
  const [user, setUser]         = useState<User | null>(null);
  const [booting, setBooting]   = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [u] = await Promise.all([getCurrentUser(), delay(1600)]);
      if (mounted) {
        setUser(u);
        setBooting(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!session) setUser(null);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    setAuthView('login');
  }

  if (booting) return <SplashScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />

      {!user &&
        (authView === 'login' ? (
          <LoginScreen onLogin={setUser} onGoToSignup={() => setAuthView('signup')} />
        ) : (
          <SignupScreen onSignup={setUser} onGoToLogin={() => setAuthView('login')} />
        ))}

      {user && (user.role === 'admin' || user.role === 'portaria') && (
        <AdminNavigator role={user.role} onLogout={handleLogout} />
      )}

      {user && user.role === 'morador' && (
        <HomeScreen user={user} onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
});