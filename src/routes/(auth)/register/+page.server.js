import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request, platform }) => {
    const data = await request.formData();
    const fullname = data.get('fullname');
    const email = data.get('email');
    const password = data.get('password');

    if (!fullname || !email || !password) {
      return fail(400, { error: 'Please fill out all fields.' });
    }

    try {
      // 1. Hash the password securely
      const passwordHash = await bcrypt.hash(password, 10);

      // 2. Insert into Cloudflare D1 Database
      const db = platform.env.DB; // Make sure this matches your Cloudflare binding name!
      
      await db.prepare(
        "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)"
      ).bind(fullname, email, passwordHash).run();

      // 3. Send them to the login page on success
      throw redirect(303, '/login');

    } catch (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return fail(400, { error: 'An account with this email already exists.' });
      }
      // If the database crashes, this will show the real error on the screen
      return fail(500, { error: 'Database error: ' + err.message });
    }
  }
};
