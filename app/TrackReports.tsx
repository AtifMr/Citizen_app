// app/TrackReports.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserReports } from '../api';

export default function TrackReportsScreen() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now();
      await AsyncStorage.setItem('userId', userId);
    }
    const data = await getUserReports(userId);
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return '#f1c40f'; // yellow
      case 'Processing':
        return '#3498db'; // blue
      case 'Solved':
        return '#27ae60'; // green
      default:
        return '#7f8c8d'; // gray
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track My Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.emptyText}>No reports submitted yet.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} />}
              <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                Status: {item.status}
              </Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f2f6f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2c3e50' },
  emptyText: { textAlign: 'center', color: '#7f8c8d', fontSize: 16, marginTop: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  category: { fontWeight: 'bold', color: '#2980b9', marginBottom: 5 },
  desc: { color: '#34495e', marginBottom: 8 },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 8 },
  status: { fontWeight: 'bold', marginBottom: 5 },
  date: { fontSize: 12, color: '#7f8c8d', textAlign: 'right' },
});
