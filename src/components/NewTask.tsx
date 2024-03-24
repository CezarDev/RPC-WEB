import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { getAllUsers } from '@/app/api/auth/[...nextauth]/route';
import { Task, User } from '@/types/task-types';
import { createTask } from '@/app/api/auth/[...nextauth]/route';
import Swal from 'sweetalert2';

export default function NewTask({ show }: { show: boolean }) {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]); 
    const [addTask, setAddTask] = useState(show);

    const [task, setTask] = useState<Task>({
        id: 0,
        name: '',
        status: 1,
        user_id: session?.user?.user_id ?? 0,
        status_id: 1,
        created_at: '',
        updated_at: ''
    });

    const messageAlert = (message: any, icon: any) => {
        Swal.fire({
          icon: icon,
          text: message,
        })
      }

    const accessToken = session?.user?.access_token;

    useEffect(() => {
        if (session?.user?.admin) {
            getAllUsers(session.user.access_token)
                .then((response) => {
                    setUsers(response.users);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [session]);

    const handleNewTask = (task: Task) => {
        console.log('Adicionando tarefa...' + task.name + ' STATUS ID ' + task.status_id + ' USER ID ' + task.user_id);

        if (task.name === '') {
            console.log('Nome da tarefa vazio');
            return;
        }

        if (accessToken) {
        createTask(task, accessToken)
            .then((response) => {
                console.log(response);
                
          if (response.message) 
                 messageAlert(response.message, 'success');
                setAddTask(false);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    return (
        <Modal show={addTask} onClose={() => setAddTask(false)} maxWidth="sm">
            <div className="p-4">
                <p className="text-lg font-semibold">Adicionar uma nova tarefa</p>
                <div className="mt-4">
                    <label htmlFor="taskName" className="block mb-2 text-sm font-medium text-gray-700">Nome da Tarefa</label>
                    <input
                        type="text"
                        id="taskName"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                        onChange={(e) => setTask({ ...task, name: e.target.value })}
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                        value={task.status_id}
                        onChange={(e) => setTask({ ...task, status_id: Number(e.target.value) })}
                    >
                        <option value="1">A fazer</option>
                        <option value="2">Em andamento</option>
                        <option value="3">Concluída</option>
                    </select>
                </div>
                {session?.user?.admin && (
                    <div className="mt-4">
                        <label htmlFor="assignedTo" className="block mb-2 text-sm font-medium text-gray-700">Atribuído a</label>
                        <select
                            id="assignedTo"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                            value={task.user_id}
                            onChange={(e) => setTask({ ...task, user_id: Number(e.target.value) })}
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{`${user.name}`}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <button onClick={() => setAddTask(false)} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
                    <button onClick={() => handleNewTask(task)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Confirmar</button>
                </div>
            </div>
        </Modal>
    );
}
