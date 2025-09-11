import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import api from "../api";

export default function TrackReports() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await api.get("/reports");
    setReports(res.data);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await api.put(`/report/${id}`, { status: newStatus });
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <FlatList
      data={reports}
      keyExtractor={(item: any) => String(item.id)}
      renderItem={({ item }) => (
        <View>
          <Text>{item.issue_type} - {item.description}</Text>
          <Text>Status: {item.status}</Text>
          <Button title="Mark Resolved" onPress={() => updateStatus(item.id, "Resolved")} />
        </View>
      )}
    />
  );
}
