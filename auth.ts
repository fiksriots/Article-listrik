import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import {getToken} from 'next-auth/jwt';
import {bindGoogleIdentity,progressIdentity,type IdentityToken} from '@/lib/auth/identity';

declare module 'next-auth' {
  interface Session {progressNeedsRelogin?:boolean;legacyProgressIds?:string[]}
}

export function googleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.AUTH_SECRET && process.env.AUTH_URL);
}

export const {handlers, auth, signIn, signOut} = NextAuth(request=>({
  providers: [Google({authorization: {params: {scope: 'openid email profile', prompt: 'select_account'}}})],
  session: {strategy: 'jwt'},
  pages: {signIn: '/akun', error: '/akun'},
  callbacks: {
    signIn({account, profile}) {
      return account?.provider === 'google' && profile?.email_verified === true;
    },
    async jwt({token,account}) {
      if(account?.provider==='google'&&account.providerAccountId){
        const previous=request&&process.env.AUTH_SECRET ? await getToken({req:request,secret:process.env.AUTH_SECRET,secureCookie:new URL(process.env.AUTH_URL||request.url).protocol==='https:'}) : null;
        bindGoogleIdentity(token as IdentityToken,account.providerAccountId,previous as IdentityToken|null);
      }
      return token;
    },
    session({session, token}) {
      const identity=token as IdentityToken;
      const owner=progressIdentity(identity);
      if (session.user && owner) session.user.id = owner;
      session.progressNeedsRelogin=!identity.googleSubject;
      session.legacyProgressIds=identity.legacyProgressIds||[];
      return session;
    },
  },
}));
