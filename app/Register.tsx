import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import api from "../src/utils/apiClient";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      console.log("🔄 Sending register request", name, email, password);
      const res = await api.post("/users/register", { name, email, password });
      console.log("✅ Response:", res.data);
    } catch (err: any) {
      console.log("❌ Register error:", err.response?.data || err.message);
    }
  };

  const testApi = async () => {
  try {
    const res = await api.get("/");
    console.log("🔥 Test API response:", res.data);
  } catch (err) {
    console.log("❌ Test API error:", err);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Button title="Test API" onPress={testApi} />
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: { color: "red", marginTop: 10 },
});
