import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LogIn, ChevronLeft, Search, Heart, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../../store/useAppStore";
import { warmThemes } from "../../constants/theme";
import { MealListItem } from "../../types/meal";
import { CATEGORIES, getMealByCategory, getMealByName } from "../services/mealApi";

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
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Zustand Store Hooks
  const { pendingAuthAction, setPendingAuthAction, clearPendingAuthAction } = useAppStore();

  // Convex Auth Hooks
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();
  const saveMealMutation = useMutation(api.savedMeals.saveMeal);

  // Fetch Saved Meals query to locate already-saved states
  const savedMealsQuery = useQuery(
    api.savedMeals.getSavedMeals,
    user?.id ? { userId: user.id } : "skip"
  );

  // Memoized lookups for saved meal IDs
  const savedMealsIds = useMemo(() => {
    if (!savedMealsQuery) return new Set<string>();
    return new Set(savedMealsQuery.map((m) => m.mealId));
  }, [savedMealsQuery]);

  // Core State Hooks
  const [selectedCategory, setSelectedCategory] = useState("Chicken");
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<MealListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Local Mutation Loading State
  const [isMutationLoading, setIsMutationLoading] = useState(false);

  // Derived State
  const isSearching = searchQuery.trim().length > 0;

  // Fetch Effect Callback (loadMeals)
  const loadMeals = async () => {
    setLoading(true);
    try {
      if (isSearching) {
        const response = await getMealByName(searchQuery);
        setMeals(response.meals || []);
      } else {
        const response = await getMealByCategory(selectedCategory);
        setMeals(response.meals || []);
      }
    } catch (err) {
      console.error("Error loading meals:", err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, [selectedCategory, searchQuery]);

  // Post-SignIn callback/hook logic:
  // Upon successful authentication, check Zustand and clear pending actions
  useEffect(() => {
    if (isAuthenticated && pendingAuthAction === "save-meal") {
      Alert.alert(
        "Welcome Back!",
        "You have signed in successfully. You can now save meals to your cooklist."
      );
      clearPendingAuthAction();
    }
  }, [isAuthenticated, pendingAuthAction]);

  const handleGoToProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/profile");
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const selectCategory = async (category: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  // Secure Save Meal Handler
  const handleSaveMeal = async (item: MealListItem) => {
    const isSaved = savedMealsIds.has(item.idMeal);

    // 1. Duplicate Guard
    if (isSaved) return;

    // 2. Authentication Handshake
    if (!isAuthenticated) {
      setPendingAuthAction("save-meal");
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert(
        "Authentication Required",
        "Please sign in to save recipes to your personal collection.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign In",
            onPress: () => router.push("/sign-in"),
          },
        ]
      );
      return;
    }

    // 3. Loading Guard
    if (isConvexAuthLoading) return;

    // 4. Mutation Execution
    setIsMutationLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await saveMealMutation({
        userId: user?.id || "",
        mealId: item.idMeal,
        name: item.strMeal,
        category: item.strCategory || selectedCategory,
        area: item.strArea || "Unknown",
        imageUrl: item.strMealThumb,
      });
    } catch (err) {
      console.error("Failed to save meal:", err);
      Alert.alert("Error", "Could not save the meal. Please try again.");
    } finally {
      setIsMutationLoading(false);
    }
  };

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">
      {/* Back Button Action Row */}
      <View className="flex-row justify-between items-center h-14 px-5 bg-background">
        <Pressable
          onPress={handleBack}
          className="flex-row items-center border border-slate-800 rounded-full py-1.5 px-3 shadow-sm active:opacity-60"
        >
          <ChevronLeft size={16} color="#2E2522" className="mr-0.5" />
          <Text className="text-main font-bold text-xs">Back</Text>
        </Pressable>

        {/* Top-Right: Account Avatar / User Icon */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleGoToProfile}
            className="w-8 h-8 rounded-full border border-border overflow-hidden items-center justify-center bg-card active:opacity-80"
          >
            {isAuthLoaded && isSignedIn ? (
              user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-xs font-black text-main uppercase">
                  {(user?.firstName || user?.emailAddresses[0]?.emailAddress || "?")[0]}
                </Text>
              )
            ) : (
              <User size={16} color="#2E2522" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Main Layout Scrollable Canvas */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-black text-main mt-4 px-5">
          Discoverable Meals
        </Text>

        {/* Categories Horizontal Slider Container */}
        <View className="my-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="flex-row gap-3"
          >
            {CATEGORIES.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  onPress={() => selectCategory(category)}
                  className={`border rounded-full py-2 px-4 ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? "text-white" : "text-muted"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Text Entry Search Area */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
            <Search size={18} color="#7A6E67" className="mr-2" />
            <TextInput
              placeholder="Search meals by Name"
              placeholderTextColor="#A3938B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
              className="flex-1 text-sm text-main"
            />
          </View>
        </View>

        {/* Conditional State Renderer Matrix */}
        {loading ? (
          <View className="py-12 justify-center items-center gap-3">
            <ActivityIndicator size="large" color="#E65F2B" />
            <Text className="text-muted text-sm font-semibold">
              {isSearching ? "Searching Meals..." : "Loading meals..."}
            </Text>
          </View>
        ) : meals.length === 0 ? (
          <View className="py-12 justify-center items-center">
            <Text className="text-muted text-sm font-semibold">
              No meals found
            </Text>
          </View>
        ) : (
          /* Grid Card Layout Specifications */
          <View className="flex-row flex-wrap justify-between px-3">
            {meals.map((item) => {
              const isSaved = savedMealsIds.has(item.idMeal);

              // Determine Button text & disabled status according to precedence matrix rules
              let buttonText = "Save Meal";
              let isDisabled = false;

              if (isSaved) {
                buttonText = "Saved";
                isDisabled = true;
              } else if (isMutationLoading) {
                buttonText = "Saving...";
                isDisabled = true;
              } else if (isConvexAuthLoading) {
                buttonText = "Connecting...";
                isDisabled = true;
              } else if (!isAuthenticated) {
                buttonText = "Save Meal";
                isDisabled = false;
              }

              return (
                <View
                  key={item.idMeal}
                  className="w-[47%] aspect-[3/4] bg-card border border-border rounded-3xl overflow-hidden shadow-sm mb-4 relative"
                >
                  {/* Upper 50% split window containing product image */}
                  <View className="w-full h-32 overflow-hidden">
                    <Image
                      source={{ uri: item.strMealThumb }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Lower section metadata details */}
                  <View className="p-3 justify-between flex-1 pb-12">
                    <View>
                      <Text
                        className="text-main font-black text-xl leading-6"
                        numberOfLines={2}
                      >
                        {item.strMeal}
                      </Text>
                      <Text className="text-muted text-[10px] font-bold mt-1">
                        {item.strCategory || selectedCategory}
                      </Text>
                    </View>
                  </View>

                  {/* Dynamic Save Button Container */}
                  <Pressable
                    onPress={() => handleSaveMeal(item)}
                    disabled={isDisabled}
                    className={`m-2 rounded-lg py-0.5 items-center justify-center shadow-black ${
                      isSaved
                        ? "bg-slate-400"
                        : isDisabled
                          ? "bg-emerald-600/60"
                          : "bg-emerald-600 active:bg-emerald-700"
                    }`}
                  >
                    <Text className="text-white font-semibold text-xl">
                      {buttonText}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
