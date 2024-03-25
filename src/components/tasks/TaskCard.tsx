import React, { useState } from 'react';
import { Task } from '@/types/task-types';
import styles from "./styles.module.css";
import Modal from '@/components/Modal';
import { useSession } from "next-auth/react";
import { deleteTask, updateTask } from "@/app/api/auth/[...nextauth]/route"
import Alert from "@/components/Alert";
import Swal from 'sweetalert2';
import ClassByStatus from '@/components/ClassByStatus';

const TaskCard = ({ task }: { task: Task }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskSelected, setTaskSelected] = useState<Task | null>(null);
  const [addTask, setAddTask] = useState(false);
  const [oldTask, setOldTask] = useState<Task | null>(null);

  // const [showAlert, setShowAlert] = useState<boolean>(false); 
  // const [alertMessage, setAlertMessage] = useState<string>('');


  const [editedTaskName, setEditedTaskName] = useState(task.name);
  const [editedTaskStatus, setEditedTaskStatus] = useState(task.status_id);

  // console.log(`statusNome: ${task.status.name}`)
  // console.log(`editedTaskStatus: ${editedTaskStatus}`)
  // console.log(`task.status.id: ${task.status.id}`)

  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const messageAlert = (message: any, icon: any) => {
    Swal.fire({
      icon: icon,
      text: message,
    })
  }

  const handleDeleteClick = (task: Task) => {
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = ( task: Task ) => {
   // setTaskSelected(task);
    //setEditedTaskName(task.name);
    //setEditedTaskStatus(task.status.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirmation = (task: Task) => {
    console.log(task);

    
    if (accessToken) {
      deleteTask(task.id, accessToken)
        .then((data) => {
          console.log(JSON.stringify(data));

          if (data.message) 
            messageAlert(data.message, 'success');
          
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          messageAlert('Erro ao deletar a tarefa', 'error')
        });
    }
    setIsDeleteModalOpen(false);
  }

  const handleEditConfirmation = (task: Task) => {
    setOldTask(task);

    task.name = editedTaskName
    task.status_id = editedTaskStatus

    console.log(task);

    if (accessToken) {
      updateTask(task, accessToken)
        .then((data) => {
          console.log(JSON.stringify(data));

          task = data.task ??  data.task;
           messageAlert(data.message, 'success');
           window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          messageAlert('Erro ao atualizar a tarefa', 'error')
          task = oldTask ?? task;
        });
    }  
    setIsEditModalOpen(false);
  }

  return (
    <div className={` ${styles.taskCard} ${ClassByStatus(editedTaskStatus)}`}>
      <h3 className={styles.taskName}>{task.name}</h3>
      <p className={styles.taskDetails}>
        {/* ID: {task.id} */}
        Criada em: {new Date(task.created_at).toLocaleString()}
        <br />
         Atualizada em: {new Date(task.updated_at).toLocaleString()}
        <br />
        Status: {task.status.name}
      </p>
      <div className="flex mt-4">
        <button onClick={() =>handleEditClick(task)} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md">Editar</button>
        <button onClick={() => handleDeleteClick(task)} className="bg-red-500 text-white px-4 py-2 rounded-md">Excluir</button>
      </div>

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
        <div className="p-4">
          <p className="text-lg font-semibold">Tem certeza que deseja excluir a task?</p>
          <div className="flex justify-end mt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
            <button onClick={() => handleDeleteConfirmation(task)} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirmar</button>
          </div>
        </div>
      </Modal> 

      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm">
        <div className="p-4">
          <p className="text-lg font-semibold">Editar tarefa</p>
          <div className="mt-4">
            <label className="block mb-2">Nome da Tarefa:</label>
            <input
              type="text"
              value={editedTaskName}
              onChange={(e) => setEditedTaskName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2">Status:</label>
            <select
              value={editedTaskStatus}
              onChange={(e) => setEditedTaskStatus(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value={1}>A fazer</option>
              <option value={2}>Em andamento</option>
              <option value={3}>Concluída</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => setIsEditModalOpen(false)} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
            <button onClick={() => handleEditConfirmation(task)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Confirmar</button>
          </div>
        </div>
      </Modal>

      <Modal show={addTask} onClose={() => setIsEditModalOpen(false)} maxWidth="sm">
          <div className="p-4">
            <p className="text-lg font-semibold">Adicionar uma nova tarefa</p>
          <div className="mt-4">
            <label htmlFor="taskName" className="block mb-2 text-sm font-medium text-gray-700">Nome da Tarefa</label>
          <input type="text" id="taskName" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full" />
        </div>
        <div className="mt-4">
          <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <select id="status" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full">
            <option value="1">A fazer</option>
            <option value="2">Em andamento</option>
            <option value="3">Concluída</option>
          </select>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsEditModalOpen(false)} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
          <button onClick={() => handleEditConfirmation(task)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Confirmar</button>
        </div>
      </div>
      </Modal>
      {/* {alertMessage && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md">
          {alertMessage}
        </div>
      )} */}
    </div>
  );
};

export default TaskCard;
