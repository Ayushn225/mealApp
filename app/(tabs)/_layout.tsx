import React from "react";
import { Tabs } from "expo-router";
import { Image, View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Compass, Heart, User as UserIcon } from "lucide-react-native";

export default function TabLayout() {
  const { user, isSignedIn } = useUser();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#667280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f3e7d8",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saving"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => {
            if (isSignedIn && user?.imageUrl) {
              return (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              );
            }
            return <UserIcon size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
