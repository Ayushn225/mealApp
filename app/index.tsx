import React from "react";
import { Text, View, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LogIn, Compass, Heart, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { warmThemes } from "../constants/theme";

// Safe custom Chef Hat representation using standard View elements to guarantee zero-crash imports
function ChefHatIcon({ size = 20, color = "#E65F2B" }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <View className="flex-row items-end justify-center -mb-0.5">
        <View style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full -mr-0.5" />
        <View style={{ backgroundColor: color }} className="w-3.5 h-3.5 rounded-full" />
        <View style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full -ml-0.5" />
      </View>
      <View style={{ backgroundColor: color }} className="w-4 h-1 rounded-sm" />
    </View>
  );
}

export default function IndexPortal() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const goToSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/sign-in");
  };

  const handleGoToProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/profile");
  };

  const handleNavigate = async (path: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path as any);
  };

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">
      {/* Top Bar Logo & Avatar Row */}
      <View className="flex-row justify-between items-center h-20 px-5 border-b border-border bg-background">
        <View className="flex-row items-center gap-2 border border-border rounded-full py-1.5 px-3.5 bg-card">
          <ChefHatIcon size={20} color="#E65F2B" />
          <Text className="text-base font-black text-main tracking-tight">
            tasteMate
          </Text>
        </View>

        <View className="flex-row items-center">
          {!isLoaded ? null : !isSignedIn ? (
            <View className="border border-border rounded-full py-1.5 px-3.5 bg-card">
              <Pressable
                onPress={goToSignIn}
                className="flex-row items-center gap-1.5 active:opacity-60"
              >
                <LogIn size={16} color="#E65F2B" />
                <Text className="text-primary text-sm font-bold">Sign In</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleGoToProfile}
              className="w-10 h-10 rounded-full border border-border overflow-hidden items-center justify-center bg-card active:opacity-80"
            >
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-sm font-black text-main uppercase">
                  {(user?.firstName || user?.emailAddresses[0]?.emailAddress || "?")[0]}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Main Content Portal Navigation */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text className="text-3xl font-black text-main mb-2">
          Hello {user?.firstName || "Foodie"}!
        </Text>
        <Text className="text-muted text-sm font-semibold mb-8">
          Where would you like to go today?
        </Text>

        {/* Portal Cards Grid */}
        <View className="gap-5">
          {/* Discover Card */}
          <Pressable
            onPress={() => handleNavigate("/(tabs)")}
            className="bg-card border border-border rounded-3xl p-6 flex-row items-center gap-5 shadow-sm active:opacity-90"
          >
            <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
              <Compass size={24} color="#E65F2B" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-main">Discover Meals</Text>
              <Text className="text-muted text-xs font-semibold mt-0.5">
                Explore thousands of recipes and filter by categories
              </Text>
            </View>
          </Pressable>

          {/* Saving Card */}
          <Pressable
            onPress={() => handleNavigate("/(tabs)/saving")}
            className="bg-card border border-border rounded-3xl p-6 flex-row items-center gap-5 shadow-sm active:opacity-90"
          >
            <View className="w-12 h-12 rounded-2xl bg-secondary/10 items-center justify-center">
              <Heart size={24} color="#F3A83B" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-main">Saved Recipes</Text>
              <Text className="text-muted text-xs font-semibold mt-0.5">
                Access recipes you saved to your personal cook list
              </Text>
            </View>
          </Pressable>

          {/* Profile Card */}
          <Pressable
            onPress={() => handleNavigate("/(tabs)/profile")}
            className="bg-card border border-border rounded-3xl p-6 flex-row items-center gap-5 shadow-sm active:opacity-90"
          >
            <View className="w-12 h-12 rounded-2xl bg-accent/10 items-center justify-center">
              <User size={24} color="#8A3324" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-main">My Profile</Text>
              <Text className="text-muted text-xs font-semibold mt-0.5">
                Manage your credentials and sign out of your account
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
