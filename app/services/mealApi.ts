import { MealListResponse } from "../../types/meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

export const CATEGORIES = [
  "Chicken",
  "Dessert",
  "Miscellaneous",
  "Pasta",
  "Seafood",
  "Side",
  "Vegan",
  "Vegetarian",
  "Breakfast",
];

export async function getMealByCategory(category: string): Promise<MealListResponse> {
  const response = await fetch(`${BASE_URL}filter.php?c=${category}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getMealByName(query: string): Promise<MealListResponse> {
  const trimmed = query.trim();
  const endpoint = trimmed.length === 1 ? `search.php?f=${trimmed}` : `search.php?s=${trimmed}`;
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
