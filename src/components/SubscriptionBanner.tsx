import React from 'react';
import { Crown, Zap } from 'lucide-react';

interface SubscriptionBannerProps {
  isVisible: boolean;
  onUpgrade: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ isVisible, onUpgrade }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-300" size={24} />
          <div>
            <h3 className="text-lg font-bold">Upgrade to Premium</h3>
            <p className="text-purple-100">Get unlimited recipe recommendations and save your favorites!</p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
        >
          <Zap size={16} />
          Upgrade Now
        </button>
      </div>
    </div>
  );
};