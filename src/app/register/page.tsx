'use client'
import { redirect } from "next/navigation"
import { useState } from "react"

interface Form{
    email: string,
    username: string,
    store: string,
    password: string
}

export default function Register(){
    const [isLoading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<Form>({
        email: '',
        username: '',
        store: '',
        password: ''
    })

    async function handleSub(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        setLoading(true)
        const formData = new FormData();

        formData.append("email", form.email)
        formData.append("username", form.username)
        formData.append("store", form.store)
        formData.append("password", form.password)

        try {
            const res = await fetch('/api/auth/register',{
                method: "POST",
                body: formData
              })
              console.log(await res.json())
              if(res.status === 200){
                redirect('/')
              }
        } catch (error) {
            console.error(error)
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setForm({...form, [event.target.name]: event.target.value})
    }

    return(
        <main className="flex font-poppins items-center justify-center bg-gray-100 dark:bg-gray-900 min-w-screen min-h-screen">
            <form onSubmit={handleSub} className="card bg-base-100 w-[300px] shadow-xl p-6">
            <h1 className="card-title">Register</h1>

            <label className="mt-2 mb-3 input input-bordered flex items-center gap-2">Email
            <input onChange={handleChange} required type="email" name="email" className="grow w-0" placeholder="user@test.com" /></label>

            <label className="mt-2 mb-3 input input-bordered flex items-center gap-2">Username
            <input onChange={handleChange} required type="text" name="username" className="grow w-0" placeholder="Username" /></label>

            <label className="mt-2 mb-3 input input-bordered flex items-center gap-2">Store Name
            <input onChange={handleChange} required type="text" name="store" className="grow w-0" placeholder="Store Name" /></label>

            <label className="mt-2 mb-3 input input-bordered flex items-center gap-2">Password
            <input onChange={handleChange} required type="password" name="password" className="grow w-0" placeholder="*******" /></label>

            <button disabled={isLoading} type="submit" className="btn btn-outline">
                {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Register'}
            </button>
            </form>
        </main>
    )
}