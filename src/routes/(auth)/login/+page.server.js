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
      cookies.set('session', user.id.toString(), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 7 // Lasts for 1 week
      });

      // 4. Send them to the app
      throw redirect(303, '/');

    } catch (err) {
      // This will catch database errors and show them in the red box!
      return fail(500, { error: 'Database error: ' + err.message });
    }
  }
};
