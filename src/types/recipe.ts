export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine_type?: string;
  created_at: string;
  user_id?: string;
}

export interface User {
  id: string;
  email: string;
  subscription_status: 'free' | 'premium';
  subscription_end_date?: string;
  created_at: string;
}

export interface RecipeSearch {
  id: string;
  user_id: string;
  ingredients: string[];
  recipes: Recipe[];
  created_at: string;
}