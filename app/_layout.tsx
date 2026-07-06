import React from "react";
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { warmThemes } from "../constants/theme";
import "../global.css";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore save item error: ", err);
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "";
  const convex = new ConvexReactClient(convexUrl);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default function RootLayout() {
  return (
    <ConvexClerkProvider>
      <StatusBar style="dark" />
      <View style={warmThemes.light} className="flex-1 bg-background">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </View>
    </ConvexClerkProvider>
  );
}