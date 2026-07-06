import React from "react";
import { Text, View, Pressable, Image } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LogIn, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { warmThemes } from "../../constants/theme";

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

export default function DiscoverTab() {
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

  return (
    <View style={warmThemes.light} className="flex-1 bg-background pt-safe">
      <View className="flex-1 px-5 pt-1">
        {/* Top Bar Layout */}
        <View className="flex-row justify-between items-center h-20">
          {/* Top-Left: Logo & Name with rounded border outline */}
          <View className="flex-row items-center gap-2 border border-border rounded-full py-2 px-4 bg-card">
            <ChefHatIcon size={24} color="#E65F2B" />
            <Text className="text-lg font-black text-main tracking-tight">
              tasteMate
            </Text>
          </View>

          {/* Top-Right: Auth Status Area / Avatar */}
          <View className="flex-row items-center">
            {!isLoaded ? null : !isSignedIn ? (
              <View className="border border-border rounded-full py-2 px-4 bg-card">
                <Pressable
                  onPress={goToSignIn}
                  className="flex-row items-center gap-1.5 active:opacity-60"
                >
                  <LogIn size={18} color="#E65F2B" />
                  <Text className="text-primary text-sm font-bold">Sign In</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleGoToProfile}
                className="w-11 h-11 rounded-full border border-border overflow-hidden items-center justify-center bg-card active:opacity-80"
              >
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-full h-full"
                  />
                ) : (
                  <Text className="text-base font-black text-main uppercase">
                    {(user?.firstName || user?.emailAddresses[0]?.emailAddress || "?")[0]}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 justify-center items-center pb-20">
          <Text className="text-2xl font-black text-main text-center mb-2">
            Welcome to tasteMate
          </Text>
          <Text className="text-muted text-center text-sm font-medium mb-8">
            Your personalized smart recipe helper
          </Text>

          {isSignedIn && user && (
            <View className="bg-card border border-border py-6 px-6 rounded-3xl items-center gap-4 shadow-sm w-full max-w-xs">
              {user.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-16 h-16 rounded-full border-2 border-primary/20"
                />
              ) : (
                <User size={32} color="#E65F2B" />
              )}
              <View className="items-center">
                <Text className="text-main text-base font-black text-center">
                  {user.fullName || user.firstName || "Welcome back!"}
                </Text>
                <Text className="text-muted text-xs font-semibold text-center mt-0.5">
                  {user.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
