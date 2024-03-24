"use client"

import styles from "./styles.module.css";
import {  signIn } from "next-auth/react";
import Link from "next/link";
import ButtonLogout from "@/components/ButtonLogout";
import NewTask from "../NewTask";
import { useState } from "react"; 

export function Header({ session }: { session: any }) {

  const [addTask, setAddTask] = useState(false); 
  console.log(`addTask: ${addTask}`)
  return (  
    <header className={`${styles.header} sm:w-full md:w-auto`}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas
            </h1>
          </Link>
          
          <button
            className={styles.link}
            onClick={() => setAddTask(!addTask)} 
          >
            Adicionar Tarefa
          </button>
        </nav>

        {session ? (
          <>
             <strong className={styles.logo}> {session?.user?.name} </strong>

          <ButtonLogout />
          </>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("credentials")}
          >
            Acessar
          </button>
        )}
      </section>

       { addTask && <NewTask show={addTask} /> }
    </header>
  );
}
