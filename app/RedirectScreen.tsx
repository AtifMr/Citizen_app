import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RedirectScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const role = await AsyncStorage.getItem("role");

        if (userId) {
          if (role === "admin") {
            router.replace("/TrackReports");
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/AuthHome");
        }
      } catch (err) {
        console.log("❌ Error checking login:", err);
        router.replace("/AuthHome");
      } finally {
        setChecking(false);
      }
    };

    checkLogin();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
