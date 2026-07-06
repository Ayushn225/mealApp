import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LogIn, ChevronLeft, Search, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";
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

  // Core State Hooks
  const [selectedCategory, setSelectedCategory] = useState("Chicken");
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<MealListItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  const goToSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/sign-in");
  };

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

  const handleSaveMeal = async (item: MealListItem) => {
    if (!isAuthLoaded) return;

    if (!isSignedIn) {
      // Intercept and route to Sign In
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push("/sign-in");
    } else {
      // Authenticated save action
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log("Saving meal:", item.strMeal);
    }
  };

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">

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
            {meals.map((item) => (
              <View
                key={item.idMeal}
                className="w-[47%] aspect-[3/4] bg-card border border-border rounded-3xl overflow-hidden shadow-sm mb-4 relative"
              >
                {/* Upper 50% split window containing product image */}
                <Image
                  source={{ uri: item.strMealThumb }}
                  className="w-full h-[50%] object-cover"
                />

                {/* Lower section metadata details */}
                <View className="p-3 justify-between flex-1 pb-12">
                  <View>
                    <Text
                      className="text-main font-black text-xs leading-4"
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
                  className="absolute bottom-0 left-0 right-0 bg-emerald-600 py-2.5 items-center justify-center active:bg-emerald-700"
                >
                  <Text className="text-white font-black text-xs">
                    {!isAuthLoaded ? "Loading..." : "Save meal"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
