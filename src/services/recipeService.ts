import { supabase } from '../lib/supabase';
import { Recipe } from '../types/recipe';

export const getRecipeRecommendations = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-recipe-recommendations', {
      body: { ingredients }
    });

    if (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recipe recommendations');
    }

    return data.recipes || [];
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const saveRecipeSearch = async (ingredients: string[], recipes: Recipe[]) => {
  try {
    const { data, error } = await supabase
      .from('recipe_searches')
      .insert({
        ingredients,
        recipes
      });

    if (error) {
      console.error('Error saving search:', error);
    }

    return data;
  } catch (error) {
    console.error('Service error:', error);
  }
};

export const getUserSearchHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('recipe_searches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error getting search history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Service error:', error);
    return [];
  }
};