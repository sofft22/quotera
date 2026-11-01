import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');
  
  const db = platform.env.DB;
  const stats = await db.prepare("SELECT COUNT(*) as count FROM quotes WHERE user_id = ?").bind(Number(session)).first();
  
  // Fetch the full user object for the PDF colors and logo
  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(Number(session)).first();
  
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
    const db = platform.env.DB;
    
    try {
      await db.prepare(
        "INSERT INTO quotes (user_id, customer_name, customer_contact, total, items_json, subtotal, discount, delivery, vat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        Number(session), 
        data.get('customerName'), 
        data.get('customerContact'), 
        data.get('total'),
        data.get('itemsJson'),
        data.get('subtotal'),
        data.get('discount'),
        data.get('delivery'),
        data.get('vat')
      ).run();
      
      return { success: true };
    } catch (err) { 
      return fail(500, { error: 'Failed to save quote.' }); 
    }
  }
};
