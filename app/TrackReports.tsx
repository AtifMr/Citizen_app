import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../src/utils/apiClient";

type Report = {
  id: number;
  issue_type: string;
  status: string;
  // add other fields if needed
};

export default function TrackReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.issue_type} - {item.status}</Text>
        )}
      />
    </View>
  );
}
