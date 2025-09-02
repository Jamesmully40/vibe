# RecipeAI - AI-Powered Recipe Recommender

A modern recipe recommendation app that uses AI to suggest delicious recipes based on your available ingredients.

## Features

- 🤖 AI-powered recipe recommendations using OpenAI
- 🥘 Interactive ingredient selection
- 📱 Responsive design with beautiful UI
- 👤 User authentication and profiles
- 💾 Recipe search history
- 💳 Premium subscription system
- 🔒 Secure API key management

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **AI**: OpenAI GPT-3.5-turbo
- **Payments**: Stripe (for subscriptions)

## Getting Started

1. **Set up Supabase**:
   - Click "Connect to Supabase" in the top right
   - Run the database migrations to create the required tables

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and keys
   - Add your OpenAI API key

3. **Start Development**:
   ```bash
   npm run dev
   ```

## Database Schema

- **users**: User profiles with subscription status
- **recipes**: Generated recipes from AI
- **recipe_searches**: Search history and results

## API Integration

The app uses Supabase Edge Functions to securely call the OpenAI API, ensuring your API keys are never exposed to the client.

## Subscription Model

- **Free Tier**: 3 recipe searches
- **Premium**: Unlimited searches + recipe saving

## Security

- Row Level Security (RLS) enabled on all tables
- API keys secured in Edge Functions
- User data isolation and protection