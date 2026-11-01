export async function load({ cookies }) {
  const session = cookies.get('session');
  return {
    isLoggedIn: !!session
  };
}
