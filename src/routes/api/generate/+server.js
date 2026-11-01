import { json, error } from '@sveltejs/kit';

export async function POST({ request, cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw error(401, 'Not logged in');
  
  const data = await request.json();
  const rawText = data.rawText;
  const API_KEY = platform.env.GROQ_API_KEY;

  if (!API_KEY) throw error(500, 'Groq API Key is missing.');
  if (!rawText) throw error(400, 'No text provided.');

  try {
    const db = platform.env.DB;
    const priceListData = await db.prepare("SELECT * FROM price_list WHERE user_id = ?").bind(Number(session)).all();
    const products = priceListData.results || [];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "Extract items and quantities. Return ONLY a JSON array: [{\"name\": \"item\", \"qty\": 1}]." },
          { role: "user", content: rawText }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) throw new Error("AI failed");
    const aiData = await response.json();
    let responseText = aiData.choices[0].message.content.trim();
    if (responseText.startsWith("```json")) responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const extractedItems = JSON.parse(responseText);

    let nextId = 1;
    const matchedItems = extractedItems.map(aiItem => {
      const aiName = aiItem.name.toLowerCase().trim().replace(/s$/, '');
      const match = products.find(p => {
        const dbName = p.name.toLowerCase().trim().replace(/s$/, '');
        if (dbName.includes(aiName) || aiName.includes(dbName)) return true;
        const aiWords = aiName.split(' ');
        const dbWords = dbName.split(' ');
        return aiWords.some(w => dbWords.includes(w));
      });

      if (match) {
        return { id: nextId++, name: match.name, unit: match.unit, price: Number(match.price), qty: aiItem.qty || 1 };
      } else {
        return { id: nextId++, name: aiItem.name, unit: "Piece", price: 0, qty: aiItem.qty || 1 };
      }
    });

    return json({ items: matchedItems });
  } catch (err) {
    throw error(500, err.message);
  }
}
