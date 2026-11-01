import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  saveQuote: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const customerName = data.get('customerName');
    const customerContact = data.get('customerContact');
    const total = data.get('total');

    const db = platform.env.DB;

    try {
      await db.prepare(`
        INSERT INTO quotes (user_id, customer_name, customer_contact, total)
        VALUES (?, ?, ?, ?)
      `).bind(session, customerName, customerContact, total).run();

      return { success: true };
    } catch (err) {
      return fail(500, { error: err.message });
    }
  }
};
