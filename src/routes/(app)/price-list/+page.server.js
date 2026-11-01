import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;
  
  // Fetch only the current user's price list
  const products = await db.prepare(
    "SELECT * FROM price_list WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(session).all();

  return {
    products: products.results || []
  };
}

export const actions = {
  add: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const name = data.get('name');
    const unit = data.get('unit');
    const price = data.get('price');

    if (!name || !unit || !price) return fail(400, { error: 'All fields are required' });

    const db = platform.env.DB;
    
    try {
      await db.prepare(
        "INSERT INTO price_list (user_id, name, unit, price) VALUES (?, ?, ?, ?)"
      ).bind(session, name, unit, price).run();
      return { success: true };
    } catch (err) {
      return fail(500, { error: err.message });
    }
  },

  edit: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const id = data.get('id');
    const name = data.get('name');
    const unit = data.get('unit');
    const price = data.get('price');

    const db = platform.env.DB;
    
    try {
      await db.prepare(
        "UPDATE price_list SET name = ?, unit = ?, price = ? WHERE id = ? AND user_id = ?"
      ).bind(name, unit, price, id, session).run();
      return { success: true };
    } catch (err) {
      return fail(500, { error: err.message });
    }
  },

  delete: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const id = data.get('id');

    const db = platform.env.DB;
    
    try {
      await db.prepare(
        "DELETE FROM price_list WHERE id = ? AND user_id = ?"
      ).bind(id, session).run();
      return { success: true };
    } catch (err) {
      return fail(500, { error: err.message });
    }
  }
};
