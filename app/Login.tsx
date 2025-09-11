import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../src/config/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter both email and password");
//       return;
//     }

//     try {
//       console.log("🔄 Sending login request", email);
//       const res = await api.post("/users/login", { email, password });

//       const { token, user } = res.data;

//       // Save token, role, and userId
//       await AsyncStorage.setItem("token", token);
//       await AsyncStorage.setItem("role", user.role);
//       await AsyncStorage.setItem("userId", String(user.id));

//       console.log("✅ Login success:", user);
//       Alert.alert("Success", `Welcome ${user.name}!`);

//       // Redirect based on role
//       if (user.role === "admin") router.replace("/TrackReports");
//       else router.replace("/");

//     } catch (err: any) {
//       console.log("❌ Login error:", err.response?.data || err.message);
//       Alert.alert("Login Failed", "Invalid email or password");
//     }
//   };

const handleLogin = async () => {
  try {
    console.log("🔄 Sending login request", email, password);
    const res = await api.post("/users/login", { email, password });

    if (res.data.token) {
      await AsyncStorage.clear(); // clear old tokens before saving new one
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("role", res.data.user.role);
      await AsyncStorage.setItem("userId", String(res.data.user.id));


      console.log("✅ Login success, token received:", res.data.token);
      Alert.alert("Success", `Welcome ${res.data.user.name}!`);
      const stored = await AsyncStorage.getItem("token");
      console.log("🔎 Confirming stored token:", stored);
    } else {
      console.log("⚠️ No token returned from server");
    }
    if (res.data.user.role === "admin") router.replace("/TrackReports");
    else router.replace("/");
  } catch (err: any) {
    console.log("❌ Login error:", err.response?.data || err.message);
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
