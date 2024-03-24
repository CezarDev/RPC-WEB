import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { use } from "react"
import { Task } from "../../../../types/task-types";

async function fetchTasksByUser(userId: number, accessToken: string) {
    const response = await fetch(`http://localhost:8000/api/tasksByUser/${userId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },

    });

    if (!response.ok) {
        console.log(response)
        return null;
    }

    return await response.json();
}

async function getAllUsers(accessToken: string) {
	const response = await fetch('http://localhost:8000/api/users', {
		method: 'GET',
		headers: {
			'Content-type': 'application',
			'Authorization': `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		console.log(response)
		return null;
	}

	return await response.json();
}


async function createTask(task: Task, accessToken: string) {
	console.log(task.name, task.status_id, task.user_id)

	const taskData = { "name": task.name, "status_id": task.status_id, "user_id": task.user_id }

	const response = await fetch('http://localhost:8000/api/tasks', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			// 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Authorization': `Bearer ${accessToken}`
		  },
		  //origin: 'http://localhost:3000',
		body: JSON.stringify(task)
	});

	if (!response.ok) {
		console.log(response)
		return null;
	}

	return await response.json();
	
}


async function updateTask(task: Task, accessToken: string) {
	const response = await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${accessToken}`
		},
		body: JSON.stringify(task)
	});

	if (!response.ok) {
		console.log(response)
		return null;
	}

	return await response.json();
}

async function deleteTask(taskId: number, accessToken: string) {
	const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		console.log(response)
		return null;
	}

	return await response.json();
}
	


const nextAuthOptions: NextAuthOptions = {
	secret: 'secret',
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},

			async authorize(credentials, req) {

				const response = await fetch('http://localhost:8000/api/login', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password
					})
				})

				

				const user = await response.json()
				
				if (user && response.ok) {
					//console.log(user.access_token)
					return user
				}

				return null
			},
		})
	],
	pages: {
		signIn: '/'
	},
	callbacks: {
		async jwt({ token, user }) {
			//console.log(token)
			
			user && (token.user = user)
			return token
		},
		async session({ session, token }){
			//console.log(session)
			session.user = token.user as any
			//console.log(session.user)
			
			return session
		}
	}
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions, fetchTasksByUser, updateTask, deleteTask, createTask, getAllUsers}