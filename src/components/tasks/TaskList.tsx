"use client";
import { Task } from "@/types/task-types";
import TaskCard from "@/components/tasks/TaskCard";
import styles from "./styles.module.css";

type TaskListProps = {
  tasks: Task[];
};

const TaskList = ({ tasks }: TaskListProps) => {
  
  //'useClient'
  tasks = tasks === null ? [] :  tasks

  return (
    <div className={styles.tasklist}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
