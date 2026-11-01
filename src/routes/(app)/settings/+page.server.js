import { json, redirect } from '@sveltejs/kit';

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

// We are using a standard POST endpoint instead of Svelte form actions
export async function POST({ request, cookies, platform }) {
  const session = cookies.get('session');
  if (!session) return json({ error: 'Not logged in' }, { status: 401 });

  const data = await request.json();
  const db = platform.env.DB;

  try {
    await db.prepare(`
      UPDATE users 
      SET company_name = ?, company_address = ?, company_contact = ?, header_color = ?, accent_color = ?, logo_base64 = ?
      WHERE id = ?
    `).bind(
      data.companyName, 
      data.companyAddress, 
      data.companyContact, 
      data.headerColor, 
      data.accentColor, 
      data.logoBase64 || null, 
      Number(session)
    ).run();

    return json({ success: true });
  } catch (err) {
    console.error(err);
    return json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
