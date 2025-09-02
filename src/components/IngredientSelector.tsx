import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const commonIngredients = [
  'Chicken', 'Beef', 'Pork', 'Fish', 'Eggs', 'Milk', 'Cheese', 'Butter',
  'Onion', 'Garlic', 'Tomato', 'Potato', 'Carrot', 'Bell Pepper', 'Mushroom',
  'Rice', 'Pasta', 'Bread', 'Flour', 'Olive Oil', 'Salt', 'Pepper',
  'Basil', 'Oregano', 'Thyme', 'Parsley', 'Lemon', 'Lime'
];

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onIngredientsChange,
  onSearch,
  isLoading
}) => {
  const [customIngredient, setCustomIngredient] = useState('');

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(selectedIngredients.filter(i => i !== ingredient));
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      addIngredient(customIngredient.trim());
      setCustomIngredient('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Ingredients</h2>
      
      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Ingredients:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:bg-green-200 rounded-full p-1 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Ingredient */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            placeholder="Add custom ingredient..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addCustomIngredient()}
          />
          <button
            onClick={addCustomIngredient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Common Ingredients */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Common Ingredients:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {commonIngredients.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => addIngredient(ingredient)}
              disabled={selectedIngredients.includes(ingredient)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedIngredients.includes(ingredient)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={selectedIngredients.length === 0 || isLoading}
        className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
          selectedIngredients.length === 0 || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
        }`}
      >
        {isLoading ? 'Finding Recipes...' : 'Get Recipe Recommendations'}
      </button>
    </div>
  );
};