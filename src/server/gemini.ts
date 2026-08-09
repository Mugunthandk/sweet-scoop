import { GoogleGenAI } from '@google/genai';
import { db } from './db';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return aiClient;
}

export async function handleScoopBotChat(messages: { role: 'user' | 'model'; text: string }[]) {
  const client = getAIClient();
  const products = db.getProducts();

  const systemInstruction = `You are ScoopBot 🍦, the official friendly AI assistant for Sweet Scoop Artisanal Ice Cream.
You love helping customers find their dream scoops, check flavor ingredients and allergens, recommend pairings, guide custom scoop building, check order status, explain Sweet Points loyalty rewards, and find nearest stores!

Product Knowledge Base:
${products.map(p => `- ${p.name} (₹${p.price}): ${p.description}. Category: ${p.category}. Allergens: ${p.allergens.join(', ') || 'None'}. Vegan: ${p.isVegan ? 'Yes' : 'No'}. Sugar-Free: ${p.isSugarFree ? 'Yes' : 'No'}.`).join('\n')}

Special Coupons Available:
- SCOOP20: 20% OFF above ₹300
- WELCOME50: ₹50 OFF for first purchase
- SWEETVIP: 25% OFF for VIP tier

Instructions:
- Be playful, warm, helpful, and sweet! Use emojis like 🍦, 🍧, 🍨, ✨, 🍓, 🍫, 🥳.
- Keep answers concise, clear, and easy to read.
- If asking about allergens, double check the allergen list carefully.
- Offer custom scoop ideas (e.g. 2 scoops in a waffle cone with hot fudge).`;

  if (!client) {
    // Fallback if key is not configured
    const lastUserMsg = messages[messages.length - 1]?.text.toLowerCase() || '';
    if (lastUserMsg.includes('vegan')) {
      return "ScoopBot 🍦: We have amazing 100% plant-based options like **Vegan Coconut Strawberry Delight** and **Vegan Almond Matcha Green Tea**! Both are dairy-free and delicious! ✨";
    }
    if (lastUserMsg.includes('coupon') || lastUserMsg.includes('offer') || lastUserMsg.includes('discount')) {
      return "ScoopBot 🍦: Use code **SCOOP20** for 20% OFF orders over ₹300, or **WELCOME50** for ₹50 OFF your first order! 🥳";
    }
    if (lastUserMsg.includes('chocolate')) {
      return "ScoopBot 🍦: You have great taste! Try our top-seller **Double Dark Belgian Fudge** (70% dark Belgian cocoa) or our **Royal Nutty Sundae Supreme**! 🍫🍨";
    }
    return "ScoopBot 🍦: Hello! I'm ScoopBot, your artisanal ice cream concierge! How can I satisfy your sweet cravings today? Ask me for flavor recommendations, vegan options, or active coupons! 🍨✨";
  }

  try {
    const formattedContents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    return response.text || "ScoopBot 🍦: I'm delighted to assist! What flavors are you in the mood for today?";
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
      console.warn('Gemini API quota reached. Serving ScoopBot smart response fallback.');
    } else {
      console.error('Gemini API Error:', err?.message || err);
    }
    return "ScoopBot 🍦: Oops, my ice cream engine had a quick brain freeze! But I can tell you our top seller is Madagascar Vanilla Bean and Belgian Dark Fudge! 🍨✨";
  }
}

export async function getAIRecommendations(craving: string, dietary?: string, mood?: string) {
  const client = getAIClient();
  const products = db.getProducts();

  if (!client) {
    // Rule-based fallback
    return products.slice(0, 3).map(p => ({
      product: p,
      reason: `Matches your craving for ${craving || 'delicious ice cream'} with premium hand-crafted ingredients!`
    }));
  }

  try {
    const prompt = `Based on the user's input:
- Craving/Flavor Preference: "${craving}"
- Dietary Preference: "${dietary || 'None'}"
- Mood/Vibe: "${mood || 'Happy'}"

Select 3 best matching products from this list:
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description, isVegan: p.isVegan, isSugarFree: p.isSugarFree })))}

Return a valid JSON array of objects with keys: "productId" and "reason" (a 1-sentence mouth-watering explanation why this product matches).`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    const results = parsed.map((item: { productId: string; reason: string }) => {
      const product = products.find(p => p.id === item.productId);
      return product ? { product, reason: item.reason } : null;
    }).filter(Boolean);

    return results.length > 0 ? results : products.slice(0, 3).map(p => ({ product: p, reason: 'Top rated artisanal scoop chosen for you!' }));
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
      console.warn('Gemini API quota reached. Serving smart local AI recommendations fallback.');
    } else {
      console.error('AI Recommendation Error:', err?.message || err);
    }
    return products.slice(0, 3).map(p => ({
      product: p,
      reason: 'Artisanal favorite recommendation chosen for you!'
    }));
  }
}
