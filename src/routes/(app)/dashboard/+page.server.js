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
  saveQuote: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const customerName = data.get('customerName');
    const customerContact = data.get('customerContact');
    const total = data.get('total');

    // Basic validation
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
      console.error("Save Quote Error:", err);
      return fail(500, { error: 'Failed to save quote to database.' });
    }
  }
};
