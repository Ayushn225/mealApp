import React, { useState } from "react";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useSSO, useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ChevronLeft, Globe } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { getClerkSSORedirectURL } from "../../lib/auth";
import { warmThemes } from "../../constants/theme";

// Complete auth session in the browser to return tokens to the app on native platforms
WebBrowser.maybeCompleteAuthSession();

// Safe custom representation of crossed knife and fork using standard View elements to guarantee zero-crash imports
function CrossedUtensilsIcon() {
  return (
    <View className="w-14 h-14 rounded-2xl bg-white border border-border items-center justify-center shadow-sm mb-4">
      <View className="flex-row items-center gap-1.5">
        {/* Simple Fork Shape */}
        <View className="items-center justify-center">
          <View className="flex-row gap-0.5 justify-center">
            <View className="w-0.5 h-2.5 bg-primary rounded-full" />
            <View className="w-0.5 h-2.5 bg-primary rounded-full" />
            <View className="w-0.5 h-2.5 bg-primary rounded-full" />
          </View>
          <View className="w-2.5 h-2 bg-primary rounded-b-md" />
          <View className="w-0.5 h-4 bg-primary rounded-full" />
        </View>

        {/* Crossed separator */}
        <Text className="text-primary font-bold text-lg rotate-12 -mx-1">/</Text>

        {/* Simple Knife Shape */}
        <View className="items-center justify-center">
          <View className="w-1.5 h-4.5 bg-primary rounded-t-lg" />
          <View className="w-0.5 h-4 bg-primary rounded-full mt-0.5" />
        </View>
      </View>
    </View>
  );
}

export default function SignIn() {
  const router = useRouter();
  const { isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const { setActive } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/");
  };

  const handleGoogleLogic = async () => {
    if (!isLoaded || loading) return;

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const redirectUrl = getClerkSSORedirectURL();
      const { createdSessionId, setActive: setSessionActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setSessionActive) {
        await setSessionActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("SSO Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled = !isLoaded || loading;

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Top Navigation Bar */}
        <View className="flex-row justify-start items-center h-16 mt-2">
          <Pressable
            onPress={handleBack}
            className="flex-row items-center border border-slate-800 rounded-full py-1.5 px-3.5 shadow-sm active:opacity-60"
          >
            <ChevronLeft size={16} color="#2E2522" className="mr-0.5" />
            <Text className="text-main font-bold text-sm">Back</Text>
          </Pressable>
        </View>

        {/* Central Landing Box Area */}
        <View className="flex-1 justify-center items-center pb-20">
          <View className="w-full max-w-sm rounded-3xl overflow-hidden shadow-lg shadow-primary/5 bg-primary/10 border border-primary/20">
            {/* Decorative horizontal gradient line resting above the card box */}
            <LinearGradient
              colors={["#E65F2B", "#F3A83B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-1.5 w-full"
            />

            {/* Card Content Stack */}
            <View className="p-8 items-center">
              <CrossedUtensilsIcon />
              <Text className="text-2xl font-black text-main text-center mb-2">
                Welcome to MealApp
              </Text>
              <Text className="text-muted text-sm text-center mb-6 px-4">
                Sign in with Google to save your favourite meal
              </Text>

              <Pressable
                onPress={handleGoogleLogic}
                disabled={isBtnDisabled}
                className={`w-full py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3 bg-emerald-600 shadow-md ${
                  isBtnDisabled ? "opacity-50" : "active:bg-emerald-700"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Globe size={18} color="#ffffff" />
                    <Text className="text-white font-bold text-base">
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}