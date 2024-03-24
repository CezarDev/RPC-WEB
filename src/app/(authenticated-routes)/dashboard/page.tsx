
import { nextAuthOptions, fetchTasksByUser } from "@/app/api/auth/[...nextauth]/route"
import { Header } from "@/components/header/index" // Fixed import statement
import { getServerSession } from "next-auth"
import TaskList from "@/components/tasks/TaskList"
import styles from "./styles.module.css"
import { redirect } from "next/navigation";

export default async function Dashboard() {

	const session = await getServerSession(nextAuthOptions)
	const tasks = await fetchTasksByUser(session?.user?.user_id ?? 0, session?.user?.access_token ?? "")


	console.log(session)

	!session && redirect('/')

	return (
		<>
			<Header session={session} />

			<div className={styles.dashoboard}>
				<TaskList tasks={tasks} />
			</div>

		</>
	)
}