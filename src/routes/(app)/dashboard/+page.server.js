import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');
  const db = platform.env.DB;
  const stats = await db.prepare("SELECT COUNT(*) as count FROM quotes WHERE user_id = ?").bind(session).first();
  const user = await db.prepare("SELECT fullname FROM users WHERE id = ?").bind(session).first();
  return { totalQuotes: stats?.count || 0, user: user };
}

export const actions = {
  saveQuote: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });
    const data = await request.formData();
    const db = platform.env.DB;
    try {
      await db.prepare("INSERT INTO quotes (user_id, customer_name, customer_contact, total) VALUES (?, ?, ?, ?)").bind(session, data.get('customerName'), data.get('customerContact'), data.get('total')).run();
      return { success: true };
    } catch (err) { return fail(500, { error: 'Failed to save quote.' }); }
  },

  generateAI: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });
    
    const data = await request.formData();
    const rawText = data.get('rawText');
    const API_KEY = platform.env.GROQ_API_KEY;

    if (!API_KEY) return fail(500, { error: 'Groq API Key is missing in Cloudflare.' });
    if (!rawText || !rawText.trim()) return fail(400, { error: 'No text provided.' });

    try {
      const db = platform.env.DB;
      
      // 1. Get the products specifically for THIS user
      const priceListData = await db.prepare("SELECT * FROM products WHERE user_id = ?").bind(session).all();
      const products = priceListData.results || [];

      // 2. Call the AI
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

      if (!response.ok) throw new Error("AI failed to extract");
      const aiData = await response.json();
      let responseText = aiData.choices[0].message.content.trim();
      if (responseText.startsWith("```json")) responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const extractedItems = JSON.parse(responseText);

      // 3. Super Smart Matching
      let nextId = 1;
      const matchedItems = extractedItems.map(aiItem => {
        // Clean up the AI name (lowercase, remove 's' from the end)
        const aiName = aiItem.name.toLowerCase().trim().replace(/s$/, '');
        
        // Find the best match in the database
        const match = products.find(p => {
          const dbName = p.name.toLowerCase().trim().replace(/s$/, '');
          
          // If the AI name is inside the DB name, OR the DB name is inside the AI name
          if (dbName.includes(aiName) || aiName.includes(dbName)) return true;
          
          // Split into words and check if the first word matches (e.g. "soft" matches "soft tissue")
          const aiWords = aiName.split(' ');
          const dbWords = dbName.split(' ');
          return aiWords.some(w => dbWords.includes(w));
        });

        if (match) {
          return { id: nextId++, name: match.name, unit: match.unit, price: match.price, qty: aiItem.qty || 1 };
        } else {
          return { id: nextId++, name: aiItem.name, unit: "Piece", price: 0, qty: aiItem.qty || 1 };
        }
      });

      return { success: true, items: matchedItems };
    } catch (err) {
      console.error("Error:", err.message);
      return fail(500, { error: err.message });
    }
  }
};
