import React, { useState } from 'react';
import { Header } from './components/Header';
import { IngredientSelector } from './components/IngredientSelector';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AuthModal } from './components/AuthModal';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { useAuth } from './hooks/useAuth';
import { getRecipeRecommendations, saveRecipeSearch } from './services/recipeService';
import { signOut } from './lib/supabase';
import { Recipe } from './types/recipe';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCount, setSearchCount] = useState(0);

  const handleSearch = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Free tier limit
    if (searchCount >= 3 && !user.subscription_status) {
      alert('You\'ve reached your free search limit. Please upgrade to premium for unlimited searches!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const recommendedRecipes = await getRecipeRecommendations(selectedIngredients);
      setRecipes(recommendedRecipes);
      setSearchCount(prev => prev + 1);
      
      // Save search to database
      await saveRecipeSearch(selectedIngredients, recommendedRecipes);
    } catch (err) {
      setError('Failed to get recipe recommendations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setRecipes([]);
    setSelectedIngredients([]);
    setSearchCount(0);
  };

  const handleUpgrade = () => {
    alert('Stripe integration coming soon! This will redirect to the subscription page.');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onSignIn={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what ingredients you have, and we'll suggest delicious recipes you can make right now!
          </p>
        </div>

        {user && searchCount >= 2 && !user.subscription_status && (
          <SubscriptionBanner 
            isVisible={true}
            onUpgrade={handleUpgrade}
          />
        )}

        <IngredientSelector
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Finding the perfect recipes for you...</p>
            </div>
          </div>
        )}

        {recipes.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        )}

        {!user && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Sign in to start discovering amazing recipes!</p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {}}
      />

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />
    </div>
  );
}

export default App;