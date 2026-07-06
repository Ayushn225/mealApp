import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  User,
  LogIn,
  Heart,
  Compass,
  Trash2,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../../store/useAppStore";
import { warmThemes } from "../../constants/theme";

export default function SavingTab() {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Zustand Store Hooks
  const { setPendingAuthAction } = useAppStore();

  // Convex Auth & API Hooks
  const { isAuthenticated } = useConvexAuth();
  const deleteMealMutation = useMutation(api.savedMeals.deleteMeal);

  // Fetch Saved Meals
  const savedMeals = useQuery(
    api.savedMeals.getSavedMeals,
    user?.id ? { userId: user.id } : "skip"
  );

  // UI Component States
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMealIds, setSelectedMealIds] = useState<Set<string>>(new Set());

  // Navigation Cleanup Lifecycle
  useEffect(() => {
    return () => {
      // Clear selection vectors on screen unmount
      setIsMultiSelectMode(false);
      setSelectedMealIds(new Set());
    };
  }, []);

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleGoToProfileOrSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isSignedIn) {
      router.push("/profile");
    } else {
      setPendingAuthAction("saved-page");
      router.push("/sign-in");
    }
  };

  const handleDiscoverRedirect = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)");
  };

  // Card Press Handlers
  const handleCardLongPress = async (mealId: string) => {
    if (!isMultiSelectMode) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsMultiSelectMode(true);
      const newSelected = new Set(selectedMealIds);
      newSelected.add(mealId);
      setSelectedMealIds(newSelected);
    }
  };

  const handleCardPress = async (item: any) => {
    if (isMultiSelectMode) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newSelected = new Set(selectedMealIds);
      if (newSelected.has(item._id)) {
        newSelected.delete(item._id);
        // Turn off multi-select if selection set becomes empty
        if (newSelected.size === 0) {
          setIsMultiSelectMode(false);
        }
      } else {
        newSelected.add(item._id);
      }
      setSelectedMealIds(newSelected);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert(item.name, `${item.category || "Recipe"} - originating from ${item.area || "International"}.`);
    }
  };

  // Workflow 1: Single Card Deletion
  const handleDelete = async (id: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this recipe from your saved cooklist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteMealMutation({ id });
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (err) {
              console.error("Failed to delete meal:", err);
              Alert.alert("Error", "Could not remove the meal. Please try again.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // Workflow 2: Bottom Sticky Batch Deletion Menu
  const handleBatchDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const count = selectedMealIds.size;
    Alert.alert(
      "Confirm Batch Deletion",
      `Are you sure you want to delete these ${count} selected recipes?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove All",
          style: "destructive",
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              await Promise.all(
                Array.from(selectedMealIds).map((id) =>
                  deleteMealMutation({ id: id as any })
                )
              );
              setSelectedMealIds(new Set());
              setIsMultiSelectMode(false);
            } catch (err) {
              console.error("Failed to delete meals:", err);
              Alert.alert("Error", "Could not remove selected meals. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={warmThemes.light} className="flex-1 bg-background">
      {/* Sticky Header Layout */}
      <View className="flex-row justify-between items-center h-14 px-5 bg-background border-b border-border">
        <Pressable
          onPress={handleBack}
          className="flex-row items-center border border-slate-800 rounded-full py-1 px-3 shadow-sm active:opacity-60"
        >
          <ChevronLeft size={16} color="#2E2522" className="mr-0.5" />
          <Text className="text-main font-bold text-xs">Back</Text>
        </Pressable>

        {/* Top-Right Asset User / Sign-In Status */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleGoToProfileOrSignIn}
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

      {/* Screen Body */}
      {savedMeals === undefined ? (
        /* State A: Loading Barrier */
        <View className="flex-1 justify-center items-center gap-3">
          <ActivityIndicator size="large" color="#E65F2B" />
          <Text className="text-muted text-sm font-semibold">Loading...</Text>
        </View>
      ) : savedMeals.length === 0 ? (
        /* State B: Empty Set Boundary */
        <View className="flex-1 justify-center items-center px-6">
          <Heart size={44} color="#A3938B" className="mb-3 opacity-60" />
          <Text className="text-lg font-black text-main mb-2">
            No saved meals yet
          </Text>
          <Text className="text-muted text-xs font-semibold text-center mb-6 max-w-[200px]">
            Your saved recipes will appear here once you collect them!
          </Text>

          <Pressable
            onPress={handleDiscoverRedirect}
            className="flex-row items-center gap-2 bg-primary py-3 px-6 rounded-full shadow-md active:bg-orange-600"
          >
            <Compass size={18} color="#ffffff" />
            <Text className="text-white font-black text-sm">Discover</Text>
          </Pressable>
        </View>
      ) : (
        /* State C: Active Dataset Grid (Meals Mapping) */
        <View className="flex-1 relative">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16, paddingBottom: 80 }}
          >
            <View className="flex-row flex-wrap justify-between">
              {savedMeals.map((item) => {
                const isSelected = selectedMealIds.has(item._id);
                const isDeleting = deletingId === item._id;
                const buttonText = isDeleting ? "Deleting..." : "Remove";

                return (
                  <Pressable
                    key={item._id}
                    onLongPress={() => handleCardLongPress(item._id)}
                    onPress={() => handleCardPress(item)}
                    className={`w-[48%] aspect-[3/4.2] bg-card border rounded-3xl overflow-hidden shadow-sm mb-4 relative ${
                      isSelected ? "border-primary border-2" : "border-border"
                    }`}
                  >
                    {/* Upper Half: Card Image */}
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-[48%] object-cover"
                    />

                    {/* Selection State Checkbox Overlay Indicator */}
                    {isMultiSelectMode && (
                      <View className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white items-center justify-center bg-card shadow-sm">
                        <View
                          className={`w-3.5 h-3.5 rounded-full ${
                            isSelected ? "bg-primary" : "bg-transparent"
                          }`}
                        />
                      </View>
                    )}

                    {/* Lower Half Metadata Details */}
                    <View className="p-3 justify-between flex-1 pb-14">
                      <View>
                        <Text
                          className="text-main font-black text-xs leading-4"
                          numberOfLines={2}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-muted text-[10px] font-bold mt-1">
                          {item.category || "Recipe"}
                        </Text>
                      </View>
                    </View>

                    {/* Single Card Deletion Button */}
                    <Pressable
                      onPress={() => handleDelete(item._id)}
                      disabled={isMultiSelectMode || isDeleting}
                      className={`absolute bottom-2 left-2 right-2 rounded-2xl py-2 flex-row items-center justify-center gap-1 bg-rose-600 active:bg-rose-700 ${
                        (isMultiSelectMode || isDeleting) ? "opacity-55" : ""
                      }`}
                    >
                      <Trash2 size={12} color="#ffffff" />
                      <Text className="text-white font-black text-[10px]">
                        {buttonText}
                      </Text>
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Workflow 2: Bottom Sticky Batch Deletion Menu */}
          {isMultiSelectMode && (
            <View className="absolute bottom-5 left-5 right-5 bg-card border border-border rounded-full py-4 px-6 flex-row justify-between items-center shadow-lg">
              <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-primary font-black text-xs">
                    {selectedMealIds.size}
                  </Text>
                </View>
                <Text className="text-main text-xs font-black">
                  Selected
                </Text>
              </View>

              <Pressable
                onPress={handleBatchDelete}
                className="flex-row items-center gap-2 bg-rose-600 rounded-full py-2 px-5 active:bg-rose-700 shadow-sm"
              >
                <Trash2 size={14} color="#ffffff" />
                <Text className="text-white font-black text-xs">Delete Selected</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
