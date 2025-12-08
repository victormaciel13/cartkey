import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null); // { apartment: '101' }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {user ? (
        <HomeScreen
          user={user}
          onLogout={() => setUser(null)}
        />
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
