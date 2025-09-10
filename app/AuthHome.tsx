// app/AuthHome.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Citizen App</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/AdminLogin')}>
        <Text style={styles.buttonText}>Admin Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f6f8' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#2c3e50' },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, width: '70%', marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
