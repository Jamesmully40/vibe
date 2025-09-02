import React from 'react';
import { ChefHat, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignIn, onSignOut }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <ChefHat className="text-orange-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">RecipeAI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User size={16} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};