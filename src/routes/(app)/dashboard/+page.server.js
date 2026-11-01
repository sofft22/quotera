import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;
  const stats = await db.prepare("SELECT COUNT(*) as count FROM quotes WHERE user_id = ?").bind(session).first();
  const user = await db.prepare("SELECT fullname FROM users WHERE id = ?").bind(session).first();

  return {
    totalQuotes: stats?.count || 0,
    user: user
  };
}

export const actions = {
  saveQuote: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const customerName = data.get('customerName');
    const customerContact = data.get('customerContact');
    const total = data.get('total');

    if (!customerName) return fail(400, { error: 'Customer name is required to save.' });
    const db = platform.env.DB;

    try {
      await db.prepare("INSERT INTO quotes (user_id, customer_name, customer_contact, total) VALUES (?, ?, ?, ?)").bind(session, customerName, customerContact, total).run();
      return { success: true };
    } catch (err) {
      return fail(500, { error: 'Failed to save quote to database.' });
    }
  },

  generateAI: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const rawText = data.get('rawText');
    if (!rawText) return fail(400, { error: 'No text provided' });

    const API_KEY = platform.env.GROQ_API_KEY;
    if (!API_KEY) return fail(500, { error: 'Groq API Key is missing.' });

    try {
      // 1. Extract items via AI
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: "You are a backend data extraction tool. Extract requested items and quantities from the user text. Return ONLY a raw JSON array. Example format: [{\"name\": \"Hammer\", \"qty\": 2}]. If none, return []." },
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
      const db = platform.env.DB;

      // 2. Match each extracted item with the database price list
      let nextId = 1;
      const matchedItems = [];
      
      for (const aiItem of extractedItems) {
        // Search the price list for a name that matches the AI name
        const match = await db.prepare(
          "SELECT name, unit, price FROM price_list WHERE user_id = ? AND name LIKE ? LIMIT 1"
        ).bind(session, `%${aiItem.name}%`).first();

        if (match) {
          matchedItems.push({
            id: nextId++,
            name: match.name,      // Use the exact name from the DB
            unit: match.unit,      // Use the unit from the DB
            price: match.price,    // Use the price from the DB
            qty: aiItem.qty || 1
          });
        } else {
          // Fallback if the AI item isn't in the database
          matchedItems.push({
            id: nextId++,
            name: aiItem.name,
            unit: "Piece",
            price: 0,
            qty: aiItem.qty || 1
          });
        }
      }

      return { success: true, items: matchedItems };
    } catch (err) {
      console.error("AI Error:", err);
      return fail(500, { error: err.message || 'Failed to generate quote.' });
    }
  }
};
