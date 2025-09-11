import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../src/config/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await api.post("/users/login", { email, password });
    if (res.data.user) {
      await AsyncStorage.setItem("userId", String(res.data.user.id));
      await AsyncStorage.setItem("role", res.data.user.role);
      if (res.data.user.role === "admin") {
        router.replace("/TrackReports");
      } else {
        router.replace("/");
      }
      Alert.alert("Success", "Login successful ✅");
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  } catch (err: any) {
    Alert.alert("Error", err.response?.data?.message || "Login failed");
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f2f6f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: "#fff" },
});
