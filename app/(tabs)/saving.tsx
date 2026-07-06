import React from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { warmThemes } from "../../constants/theme";

export default function SavingTab() {
  const router = useRouter();

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={warmThemes.light} className="flex-1 bg-background pt-safe">
      {/* Back Button Action Row */}
      <View className="flex-row justify-start items-center h-12 px-5 bg-background">
        <Pressable
          onPress={handleBack}
          className="flex-row items-center border border-slate-800 rounded-full py-1 px-3 shadow-sm active:opacity-60"
        >
          <ChevronLeft size={16} color="#2E2522" className="mr-0.5" />
          <Text className="text-main font-bold text-xs">Back</Text>
        </Pressable>
      </View>

      {/* Content Area */}
      <View className="flex-1 justify-center items-center pb-20 px-5">
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
          <Heart size={28} color="#E65F2B" />
        </View>
        <Text className="text-2xl font-black text-main text-center mb-2">
          Your Saved Recipes
        </Text>
        <Text className="text-muted text-center text-sm font-medium">
          Recipes you save will appear here. Start exploring!
        </Text>
      </View>
    </View>
  );
}
