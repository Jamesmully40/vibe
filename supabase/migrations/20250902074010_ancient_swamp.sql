/*
  # Recipe Recommender Database Schema

  1. New Tables
    - `users` - Extended user profiles with subscription info
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `subscription_status` (text, default 'free')
      - `subscription_end_date` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recipes` - Store generated recipes
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `ingredients` (jsonb array)
      - `instructions` (jsonb array)
      - `cooking_time` (integer, minutes)
      - `difficulty` (text)
      - `cuisine_type` (text, nullable)
      - `created_at` (timestamp)
    
    - `recipe_searches` - Track user searches and results
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `ingredients` (jsonb array)
      - `recipes` (jsonb array of recipe objects)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for recipes table
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ingredients jsonb NOT NULL DEFAULT '[]',
  instructions jsonb NOT NULL DEFAULT '[]',
  cooking_time integer NOT NULL DEFAULT 30,
  difficulty text DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine_type text,
  created_at timestamptz DEFAULT now()
);

-- Create recipe searches table
CREATE TABLE IF NOT EXISTS recipe_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredients jsonb NOT NULL DEFAULT '[]',
  recipes jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_searches ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recipes policies (public read, authenticated write)
CREATE POLICY "Anyone can read recipes"
  ON recipes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Recipe searches policies
CREATE POLICY "Users can read own searches"
  ON recipe_searches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches"
  ON recipe_searches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_searches_user_id ON recipe_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_searches_created_at ON recipe_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();