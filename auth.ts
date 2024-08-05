import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    {
      id: 'warcraftLogs',
      name: 'WarcraftLogs',
      type: 'oauth',
      authorization: {
        url: 'https://www.warcraftlogs.com/oauth/authorize',
        params: { scope: '' },
      },
      token: 'https://www.warcraftlogs.com/oauth/token',
      clientId: process.env.WARCRAFTLOGS_CLIENT_ID,
      clientSecret: process.env.WARCRAFTLOGS_CLIENT_SECRET,
      userinfo: {
        request: async ({ tokens }) => {
          const accessToken = tokens.access_token;

          const req = await fetch('https://www.warcraftlogs.com/api/v2/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              query: `
                query GetUserMe {
                  userData {
                    currentUser {
                      battleTag,
                      id,
                      name
                    }
                  }
                }
              `,
            }),
          });

          const data = await req.json();

          return { ...data.data.userData.currentUser, token: accessToken };
        },
      },
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.name,
          token: profile.accessToken,
          battleTag: profile.battleTag,
        };
      },
    },
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    redirect: async ({ baseUrl }) => {
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
  },
};
