import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			user_id: number 
			email: string
			name: string
			access_token: string
			admin: boolean

		}
	}
}