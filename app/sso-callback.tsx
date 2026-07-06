import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function SSOCallbackRoute() {
  const router = useRouter();

  useEffect(() => {
    // Redirect cleanly back to main tabs path
    router.replace("/(tabs)");
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-[#FFFDF9]">
      <ActivityIndicator size="large" color="#E65F2B" />
    </View>
  );
}
