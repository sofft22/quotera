import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request, cookies, platform }) => {
    const data = await request.formData();
    const fullname = data.get('fullname');
    const email = data.get('email');
    const password = data.get('password');

    if (!fullname || !email || !password) {
      return fail(400, { error: 'Please fill out all fields.' });
    }

    try {
      // 1. Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // 2. Insert into D1 Database
      const db = platform.env.DB;
      if (!db) return fail(500, { error: 'Database binding "DB" is missing.' });

      // We use .run() and capture the result to get the new User ID
      const result = await db.prepare(
        "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)"
      ).bind(fullname, email, passwordHash).run();

      // 3. Automatically log the user in by setting the cookie
      // result.meta.last_row_id gets the ID of the user we just created
      if (result.success && result.meta && result.meta.last_row_id) {
        cookies.set('session', result.meta.last_row_id.toString(), {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 60 * 60 * 24 * 7 // Lasts for 1 week
        });
      }

      // 4. Send them straight to the dashboard
      throw redirect(303, '/dashboard');

    } catch (err) {
      // If it's a redirect, let it pass through
      if (err.status === 303) throw err;
      
      // Catch duplicate emails specifically
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return fail(400, { error: 'An account with this email already exists.' });
      }

      return fail(500, { error: 'DB Error: ' + (err.message || JSON.stringify(err)) });
    }
  }
};
