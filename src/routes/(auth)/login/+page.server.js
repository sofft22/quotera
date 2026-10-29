import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request, cookies, platform }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      return fail(400, { error: 'Please enter your email and password.' });
    }

    try {
      const db = platform.env.DB;

      if (!db) {
         return fail(500, { error: 'Database binding "DB" is missing.' });
      }

      // 1. Find the user by email
      const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

      if (!user) {
        return fail(400, { error: 'Invalid email or password.' });
      }

      // 2. Check if the password matches
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return fail(400, { error: 'Invalid email or password.' });
      }

      // 3. Create a "Session Cookie" to keep them logged in
      try {
        cookies.set('session', user.id.toString(), {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: true, // Requires HTTPS (your pages.dev is HTTPS, so this is fine)
          maxAge: 60 * 60 * 24 * 7
        });
      } catch (cookieErr) {
        return fail(500, { error: 'Cookie Error: ' + (cookieErr.message || JSON.stringify(cookieErr)) });
      }

      // 4. Send them to the app
      throw redirect(303, '/');

    } catch (err) {
      // If it's a redirect, let it pass through
      if (err.status === 303) throw err;
      
      return fail(500, { error: 'Login Error: ' + (err.message || JSON.stringify(err)) });
    }
  }
};
