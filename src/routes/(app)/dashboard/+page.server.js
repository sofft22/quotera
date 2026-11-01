import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;

  // Get the count and total value of this user's quotes
  const stats = await db.prepare(
    "SELECT COUNT(*) as count, SUM(total) as total_value FROM quotes WHERE user_id = ?"
  ).bind(session).first();

  return {
    totalQuotes: stats?.count || 0,
    totalValue: stats?.total_value || 0
  };
}

export const actions = {
  // 1. Action to save the quote
  saveQuote: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const customerName = data.get('customerName');
    const customerContact = data.get('customerContact');
    const total = data.get('total');

    if (!customerName) {
      return fail(400, { error: 'Customer name is required to save.' });
    }

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

  // 2. Action to generate the quote using Groq AI
  generateAI: async ({ request, platform }) => {
    const data = await request.formData();
    const rawText = data.get('rawText');

    if (!rawText) return fail(400, { error: 'No text provided' });

    // Securely get the key from Cloudflare
    const API_KEY = platform.env.GROQ_API_KEY;
    if (!API_KEY) return fail(500, { error: 'Groq API Key is missing in Cloudflare settings.' });

    try {
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

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq Error: ${errText}`);
      }

      const aiData = await response.json();
      let responseText = aiData.choices[0].message.content.trim();
      
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      return { success: true, items: JSON.parse(responseText) };
    } catch (err) {
      console.error("AI Error:", err);
      return fail(500, { error: err.message || 'Failed to generate quote.' });
    }
  }
};
