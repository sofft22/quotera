import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;
  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(Number(session)).first();

  if (!user) throw redirect(303, '/login');

  return {
    user: {
      fullname: user.fullname,
      email: user.email,
      company_name: user.company_name || "",
      company_address: user.company_address || "",
      company_contact: user.company_contact || "",
      header_color: user.header_color || "#24503C",
      accent_color: user.accent_color || "#C4513D",
      logo_base64: user.logo_base64 || "",
      plan: user.plan || "Free"
    }
  };
}

export const actions = {
  default: async ({ request, cookies, platform }) => {
    const session = cookies.get('session');
    if (!session) return fail(401, { error: 'Not logged in' });

    const data = await request.formData();
    const companyName = data.get('companyName');
    const companyAddress = data.get('companyAddress');
    const companyContact = data.get('companyContact');
    const headerColor = data.get('headerColor');
    const accentColor = data.get('accentColor');
    const logoBase64 = data.get('logoBase64');

    const db = platform.env.DB;

    try {
      await db.prepare(`
        UPDATE users 
        SET company_name = ?, company_address = ?, company_contact = ?, header_color = ?, accent_color = ?, logo_base64 = ?
        WHERE id = ?
      `).bind(
        companyName, 
        companyAddress, 
        companyContact, 
        headerColor, 
        accentColor, 
        logoBase64 || null, 
        Number(session)
      ).run();

      return { success: true };
    } catch (err) {
      return fail(500, { error: 'Failed to save settings.' });
    }
  }
};
