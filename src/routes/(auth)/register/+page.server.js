import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs'; // You will need to run `npm install bcryptjs` in your package.json

export const actions = {
  default: async ({ request, platform }) => {
    const data = await request.formData();
    const fullname = data.get('fullname');
    const email = data.get('email');
    const password = data.get('password');

    if (!fullname || !email || !password) {
      return fail(400, { error: 'Please fill out all fields.' });
    }

    // 1. Hash the password so it's safe
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      // 2. Insert into D1 Database
      const db = platform.env.DB;
      await db.prepare(
        "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)"
      ).bind(fullname, email, passwordHash).run();

      // 3. Send them to the login page
      throw redirect(303, '/login');

    } catch (err) {
      // If the email already exists, D1 throws an error
      if (err.message.includes('UNIQUE')) {
        return fail(400, { error: 'An account with this email already exists.' });
      }
      return fail(500, { error: 'Something went wrong. Please try again.' });
    }
  }
};
