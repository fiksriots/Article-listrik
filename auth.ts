import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export function googleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.AUTH_SECRET && process.env.AUTH_URL);
}

export const {handlers, auth, signIn, signOut} = NextAuth({
  providers: [Google({authorization: {params: {scope: 'openid email profile', prompt: 'select_account'}}})],
  session: {strategy: 'jwt'},
  pages: {signIn: '/akun', error: '/akun'},
  callbacks: {
    signIn({account, profile}) {
      return account?.provider === 'google' && profile?.email_verified === true;
    },
    session({session, token}) {
      if (session.user && token.sub) session.user.id = `google:${token.sub}`;
      return session;
    },
  },
});
