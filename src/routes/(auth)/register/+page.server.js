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
      // 1. Hash the password
      let passwordHash;
      try {
        passwordHash = await bcrypt.hash(password, 10);
      } catch (hashErr) {
        return fail(500, { error: 'Bcrypt Error: ' + (hashErr.message || 'Failed to hash password') });
      }

      // 2. Insert into D1 Database
      const db = platform.env.DB;
      if (!db) return fail(500, { error: 'Database binding "DB" is missing.' });

      await db.prepare(
        "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)"
      ).bind(fullname, email, passwordHash).run();

      // 3. Redirect to login
      throw redirect(303, '/login');

    } catch (err) {
      // If it's a redirect, let it pass through
      if (err.status === 303) throw err;
      
      // Catch duplicate emails specifically
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return fail(400, { error: 'An account with this email already exists.' });
      }

      // Force the real database error to show
      return fail(500, { error: 'DB Error: ' + (err.message || JSON.stringify(err)) });
    }
  }
};
