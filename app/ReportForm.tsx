import React, { useState } from "react";
import { View, Button, TextInput, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import api from "../api";

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!description || !imageUri || !userId) {
      return Alert.alert("Error", "Fill all fields and login first");
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("issue_type", category);
      formData.append("description", description);
      formData.append("latitude", "22.58");
      formData.append("longitude", "88.33");
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "report.jpg",
      } as any);

      const res = await api.post("/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Report submitted ✅");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed");
    }
  };

  return (
    <View>
      <TextInput placeholder="Describe issue" value={description} onChangeText={setDescription} />
      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
      <Button title="Submit Report" onPress={handleSubmit} />
    </View>
  );
}
