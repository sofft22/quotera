import { redirect } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
  const session = cookies.get('session');
  if (!session) throw redirect(303, '/login');

  const db = platform.env.DB;
  const userId = Number(session);

  // 1. Automatically delete quotes older than 30 days for this user
  await db.prepare(
    "DELETE FROM quotes WHERE user_id = ? AND created_at < date('now', '-30 days')"
  ).bind(userId).run();

  // 2. Fetch the remaining quotes
  const quotesData = await db.prepare(
    "SELECT * FROM quotes WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();

  return {
    quotes: quotesData.results || []
  };
}
