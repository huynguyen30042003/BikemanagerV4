import { BE_URL } from "@/shared/constants/apiConstants";
import NextAuth from "next-auth";

const handler = NextAuth({
	providers: [
		{
			id: "orchard",
			name: "Orchard",
			type: "oauth",

			clientId: "nextjs-client",

			issuer: BE_URL,

			wellKnown:
				`${BE_URL}/.well-known/openid-configuration`,

			authorization: {
				params: {
					scope: "openid profile email roles",
				},
			},

			checks: ["pkce", "state"],

			idToken: true,
			client: {
				token_endpoint_auth_method: "none",
			},

			profile(profile) {
				return {
					id: profile.sub || profile.name || crypto.randomUUID(),

					name: profile.name || profile.preferred_username,

					email: profile.email,
				};
			},
		},
	],

	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token;
			}

			return token;
		},

		async session({ session, token }) {
			session.accessToken = token.accessToken as string;

			return session;
		},
	},

	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
