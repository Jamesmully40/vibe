import React from 'react';
import { Clock, ChefHat, Users } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{recipe.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.cooking_time} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat size={16} />
            <span>{recipe.cuisine_type || 'International'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>4 servings</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
              >
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{recipe.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};