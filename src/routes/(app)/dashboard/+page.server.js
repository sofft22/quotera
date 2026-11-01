import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;

  // Get the count of quotes
  const stats = await db.prepare(
    "SELECT COUNT(*) as count FROM quotes WHERE user_id = ?"
  ).bind(session).first();

  // Get the user's details
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
      await db.prepare(`
        INSERT INTO quotes (user_id, customer_name, customer_contact, total)
        VALUES (?, ?, ?, ?)
      `).bind(session, customerName, customerContact, total).run();

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
    if (!API_KEY) return fail(500, { error: 'Groq API Key is missing in Cloudflare settings.' });

    try {
      // 1. Ask AI to extract items
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: "You are a backend data extraction tool. Extract the requested items and their quantities from the user text. Return ONLY a raw JSON array. Do not use markdown blocks. Example format: [{\"name\": \"Hammer\", \"qty\": 2}]. If no items are found, return []."
            },
            { role: "user", content: rawText }
          ],
          temperature: 0.1
        })
      });

      if (!response.ok) throw new Error("AI failed to extract");
      const aiData = await response.json();
      let responseText = aiData.choices[0].message.content.trim();
      
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      const extractedItems = JSON.parse(responseText);

      // 2. Fetch the user's price list from the database
      const db = platform.env.DB;
      const priceList = await db.prepare("SELECT * FROM price_list WHERE user_id = ?").bind(session).all();
      const products = priceList.results || [];

      // 3. Match AI items to the database price list
      let nextId = 1;
      const matchedItems = extractedItems.map(aiItem => {
        // Find a product that matches the AI name closely
        const match = products.find(p => 
          p.name.toLowerCase().includes(aiItem.name.toLowerCase()) || 
          aiItem.name.toLowerCase().includes(p.name.toLowerCase())
        );

        return {
          id: nextId++,
          name: match ? match.name : aiItem.name, // Use DB name if matched
          unit: match ? match.unit : "Piece",     // Pull unit from DB
          price: match ? match.price : 0,         // Pull price from DB
          qty: aiItem.qty || 1
        };
      });

      return { success: true, items: matchedItems };
    } catch (err) {
      console.error("AI Error:", err);
      return fail(500, { error: err.message || 'Failed to generate quote.' });
    }
  }
};
