import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/config/api";

type Report = {
  id: number;
  user_id: number;
  issue_type: string;
  description: string;
  status: string;
  image_url?: string | null;
  created_at: string;
};

export default function TrackReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reports from backend
  const fetchReports = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role"); // Admin role

    if (!token || role !== "admin") {
      Alert.alert("Error", "You must be logged in as admin");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
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

  // Update report status
  const updateStatus = async (reportId: number, newStatus: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      await api.put(`/report/${reportId}`, { status: newStatus });
      console.log(`✅ Report ${reportId} status updated to ${newStatus}`);
      // Update local state
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      console.log("❌ Status update error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to update status");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Reports (Admin)</Text>
      {reports.length === 0 ? (
        <Text style={styles.emptyText}>No reports available.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.issue}>
                {item.issue_type} — {item.status}
              </Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.info}>
                User ID: {item.user_id} | Submitted:{" "}
                {new Date(item.created_at).toLocaleString()}
              </Text>

              <View style={styles.statusButtons}>
                {["Pending", "In Progress", "Resolved"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      item.status === status && styles.selectedStatus,
                    ]}
                    onPress={() => updateStatus(item.id, status)}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status === status && styles.selectedStatusText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f6f8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#2c3e50" },
  emptyText: { textAlign: "center", color: "#7f8c8d", fontSize: 16, marginTop: 30 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 12 },
  issue: { fontWeight: "bold", color: "#e67e22", marginBottom: 5 },
  desc: { color: "#34495e", marginBottom: 5 },
  info: { fontSize: 12, color: "#7f8c8d", marginBottom: 10 },
  statusButtons: { flexDirection: "row" },
  statusButton: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  selectedStatus: { backgroundColor: "#3498db" },
  statusText: { color: "#3498db", fontSize: 12 },
  selectedStatusText: { color: "#fff", fontWeight: "bold" },
});
