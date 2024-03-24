interface Task {
    status: any;
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    status_id: number;
    user_id: number;
  }



  
interface TaskListProps {
    Tasks: Task[];
  }


interface User {
    id: number;
    email: string;
    name: string;
    access_token: string;
    admin: boolean;
}  
  



export type { Task, TaskListProps, User};