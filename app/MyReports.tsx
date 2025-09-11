import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/config/api";

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    (async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const res = await api.get(`/myreports/${userId}`);
          setReports(res.data);
        } catch (err) {
          console.log("❌ Error fetching reports:", err);
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
        🗂 My Reports
      </Text>
      <FlatList
        data={reports}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Image
              source={{ uri: item.image_url }}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
            <Text>🛠 {item.issue_type}</Text>
            <Text>📄 {item.description}</Text>
            <Text>📍 {item.latitude}, {item.longitude}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
