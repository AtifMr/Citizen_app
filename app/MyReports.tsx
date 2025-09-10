import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/config/api";

type Report = {
  id: number;
  issue_type: string;
  description: string;
  status: string;
  image_url?: string | null;
  created_at: string;
};

export default function MyReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
      Alert.alert("Error", "Please login first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter reports by user_id
      const userReports = res.data.filter((r: any) => String(r.user_id) === userId);
      setReports(userReports);
    } catch (err: any) {
      console.log("❌ Fetch error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.emptyText}>No reports submitted yet.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.category}>{item.issue_type} — {item.status}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
              <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f6f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#2c3e50" },
  emptyText: { textAlign: "center", color: "#7f8c8d", fontSize: 16, marginTop: 30 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 12 },
  category: { fontWeight: "bold", color: "#2980b9", marginBottom: 5 },
  desc: { color: "#34495e", marginBottom: 8 },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
  date: { fontSize: 12, color: "#7f8c8d", textAlign: "right" },
});
