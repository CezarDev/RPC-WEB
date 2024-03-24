'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent,  useState } from "react";
import Alert from "@/components/Alert";

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showAlert, setShowAlert] = useState<boolean>(false); 

  const router = useRouter()

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setShowAlert(true)
      console.log(result)
  //

      return
    }

    router.replace('/dashboard')
  }

  

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  ">      
     {showAlert && (
        <Alert message="Credenciais inválidas. Por favor, verifique seu e-mail e senha." type="error" />
      )}

       <img src="/assets/task.gif" alt="Tarefas GIF" className="w-48 h-auto mb-6 rounded-2xl" />

      <h1 className="text-3xl mb-6">Login</h1>

      <form className="w-[400px] flex flex-col gap-6 " onSubmit={handleSubmit}>
        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300 hover:border-blue-400"
          type="text" 
          name="email" 
          //value="s"
          placeholder="Digite seu e-mail" 
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300 hover:border-blue-400"
          type="password" 
          name="password" 
          //value="senha123"
          placeholder="Digite sua senha" 
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-12 rounded-md bg-gray-300 text-gray-800 hover:bg-blue-400"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
