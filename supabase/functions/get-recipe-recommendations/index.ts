import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine_type?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least one ingredient' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // OpenAI API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional chef assistant. Generate exactly 4 unique, practical recipes using the provided ingredients. Each recipe should be realistic and delicious. Return ONLY a valid JSON array with this exact structure:
            [
              {
                "title": "Recipe Name",
                "description": "Brief appetizing description (2-3 sentences)",
                "ingredients": ["ingredient 1", "ingredient 2", "etc"],
                "instructions": ["step 1", "step 2", "etc"],
                "cooking_time": 30,
                "difficulty": "Easy|Medium|Hard",
                "cuisine_type": "Italian|Asian|Mexican|etc"
              }
            ]
            Make sure all recipes are different and use the provided ingredients creatively.`
          },
          {
            role: 'user',
            content: `Create 4 recipes using these ingredients: ${ingredients.join(', ')}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    let recipesData: Recipe[];
    try {
      recipesData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from AI');
    }

    // Add IDs and save recipes to database
    const recipesWithIds = recipesData.map(recipe => ({
      ...recipe,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }));

    // Save recipes to database
    const { error: insertError } = await supabase
      .from('recipes')
      .insert(recipesWithIds);

    if (insertError) {
      console.error('Error saving recipes:', insertError);
      // Continue anyway, don't fail the request
    }

    return new Response(
      JSON.stringify({ recipes: recipesWithIds }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate recipe recommendations',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});