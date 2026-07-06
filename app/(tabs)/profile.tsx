import React from "react";
import { Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { User as UserIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { warmThemes } from "../../constants/theme";

export default function ProfileTab() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signOut();
    router.replace("/");
  };

  const handleRedirectToLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/sign-in");
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={warmThemes.light} className="flex-1 bg-background justify-center items-center">
        <Text className="text-muted text-sm font-semibold">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center items-center pb-12">
        {isSignedIn && user ? (
          /* State 1: Authenticated User Card */
          <View className="w-full max-w-sm bg-card border border-border rounded-3xl p-8 items-center shadow-sm">
            {user.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-24 h-24 rounded-full border-4 border-primary/20 mb-4"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 mb-4 items-center justify-center">
                <Text className="text-2xl font-black text-primary uppercase">
                  {(user.firstName || user.emailAddresses[0].emailAddress)[0]}
                </Text>
              </View>
            )}

            <Text className="text-xl font-black text-main text-center mb-1">
              {user.fullName || user.firstName || "Welcome back!"}
            </Text>
            <Text className="text-muted text-sm font-semibold text-center mb-8">
              {user.primaryEmailAddress?.emailAddress}
            </Text>

            <Pressable
              onPress={handleSignOut}
              className="w-full py-4 bg-red-600 rounded-2xl items-center justify-center active:bg-red-700 shadow-md shadow-red-100"
            >
              <Text className="text-white font-black text-base">Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          /* State 2: Guest / Not Authenticated Placeholder Card */
          <Pressable
            onPress={handleRedirectToLogin}
            className="w-full max-w-sm bg-card border border-border border-dashed rounded-3xl p-8 items-center active:opacity-90 shadow-sm"
          >
            <View className="w-24 h-24 rounded-full bg-slate-100 mb-4 items-center justify-center">
              <UserIcon size={44} color="#667280" />
            </View>

            <Text className="text-xl font-black text-main text-center mb-2">
              Not Logged In
            </Text>
            <Text className="text-muted text-sm font-medium text-center mb-6">
              Tap here to sign in and save your preferences
            </Text>

            <View className="w-full py-4 bg-primary rounded-2xl items-center justify-center">
              <Text className="text-white font-black text-base">Sign In</Text>
            </View>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
