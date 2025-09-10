// app/index.tsx
import React, { useState } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { submitReport } from '../api';

export default function ReportScreen() {
  const router = useRouter();
  const [image, setImage] = useState<ImageManipulator.ImageResult | null>(null);
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [severity, setSeverity] = useState('Low');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [uploading, setUploading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Camera permission required');

    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const resized = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(resized);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Location permission required');
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleSubmit = async () => {
    if (!image || !location || !desc) return Alert.alert('Please provide photo, description, and location');

    setUploading(true);

    // Persistent userId
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now();
      await AsyncStorage.setItem('userId', userId);
    }

    const report = {
      userId,
      description: desc,
      category,
      severity,
      lat: location.latitude,
      lng: location.longitude,
      imageUri: image.uri,
    };

    await submitReport(report);

    setUploading(false);
    Alert.alert('Success', 'Issue submitted!');
    setDesc('');
    setImage(null);
    setLocation(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Citizen Issue Reporting</Text>

      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <TouchableOpacity style={styles.photoButton} onPress={getLocation}>
        <Text style={styles.buttonText}>📍 Get Location</Text>
      </TouchableOpacity>
      {location && (
        <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
        </Text>
      )}

      <TextInput
        placeholder="Describe the issue..."
        value={desc}
        onChangeText={setDesc}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.optionsContainer}>
        {['Pothole', 'Streetlight', 'Garbage'].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.optionButton, category === cat && styles.selectedOption]}
          >
            <Text style={[styles.optionText, category === cat && styles.selectedText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Severity:</Text>
      <View style={styles.optionsContainer}>
        {['Low', 'Medium', 'High'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSeverity(s)}
            style={[styles.optionButton, severity === s && styles.selectedOption]}
          >
            <Text style={[styles.optionText, severity === s && styles.selectedText]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.submitText}>{uploading ? 'Submitting...' : 'Submit Issue'}</Text>
      </TouchableOpacity>

      {/* Track Reports button */}
      <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/TrackReports')}>
        <Text style={styles.viewText}>Track Reports</Text>
      </TouchableOpacity>

      {/* My Reports button */}
      <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/MyReports')}>
        <Text style={styles.viewText}>My Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f6f8' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2c3e50' },
  photoButton: { backgroundColor: '#3498db', padding: 12, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  image: { width: '100%', height: 200, borderRadius: 10, marginVertical: 10 },
  locationText: { textAlign: 'center', marginBottom: 10, color: '#34495e' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15, backgroundColor: '#fff', minHeight: 60 },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#2c3e50' },
  optionsContainer: { flexDirection: 'row', marginBottom: 15 },
  optionButton: { borderWidth: 1, borderColor: '#3498db', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginRight: 10 },
  selectedOption: { backgroundColor: '#3498db' },
  optionText: { color: '#3498db' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  viewButton: { padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#e67e22', marginBottom: 10 },
  viewText: { color: '#fff', fontWeight: 'bold' },
});
