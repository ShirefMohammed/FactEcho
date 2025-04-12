export async function sessionCallback(session: any, token: any) {
  if (token) {
    session.user = {
      ...session.user,
      user_id: token.id as string,
      name: token.name as string,
      email: token.email as string,
      role: token.role as number,
      avatar: token.avatar as string,
    };
  }

  return session;
}
