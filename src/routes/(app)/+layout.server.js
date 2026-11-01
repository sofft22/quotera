import { redirect } from '@sveltejs/kit';

export async function load({ cookies, parent }) {
  // Get the isLoggedIn status from the root layout
  const { isLoggedIn } = await parent();

  // If they aren't logged in, kick them back to the login page
  if (!isLoggedIn) {
    throw redirect(303, '/login');
  }

  return {};
}
