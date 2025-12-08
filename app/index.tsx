
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { User } from './service/api';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {user ? (
        <HomeScreen user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginScreen onLogin={setUser} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
});
