import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../src/config/api";

export default function ReportScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [category, setCategory] = useState("Pothole");
  const [severity, setSeverity] = useState("Low");
  const [uploading, setUploading] = useState(false);

  // Pick image from camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Camera permission required");

    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Get current location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Location permission required");

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  // Submit report to backend
  const handleSubmit = async () => {
    if (!imageUri || !location || !description) {
      return Alert.alert(
        "Error",
        "Please provide photo, description, and location"
      );
    }

    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      return Alert.alert("Error", "Please login first");
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("issue_type", category);
      formData.append("description", description);
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "report.jpg",
      } as any);
      console.log("🔄 Submitting report", {
        category,
        severity,
        description,
        location,
      });
      const res = await api.post("/report", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add this
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Report submitted:", res.data);
      Alert.alert("Success", "Report submitted successfully!");

      setImageUri(null);
      setDescription("");
      setLocation(null);
    } catch (err: any) {
      console.log("Submit Error");
      console.log("❌ Submit error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to submit report"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Submit a Report</Text>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>📍 Get Location</Text>
      </TouchableOpacity>
      {location && (
        <Text style={styles.text}>
          Lat: {location.latitude.toFixed(5)}, Lng:{" "}
          {location.longitude.toFixed(5)}
        </Text>
      )}

      <TextInput
        placeholder="Describe the issue..."
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.options}>
        {["Pothole", "Streetlight", "Garbage"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.optionButton,
              category === cat && styles.selectedOption,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.optionText,
                category === cat && styles.selectedText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Severity:</Text>
      <View style={styles.options}>
        {["Low", "Medium", "High"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.optionButton,
              severity === s && styles.selectedOption,
            ]}
            onPress={() => setSeverity(s)}
          >
            <Text
              style={[styles.optionText, severity === s && styles.selectedText]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, uploading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.submitText}>
          {uploading ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f6f8" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  image: { width: "100%", height: 200, marginVertical: 10, borderRadius: 10 },
  text: { textAlign: "center", marginBottom: 10, color: "#34495e" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  options: { flexDirection: "row", marginBottom: 15 },
  optionButton: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  selectedOption: { backgroundColor: "#3498db" },
  optionText: { color: "#3498db" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
