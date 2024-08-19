'use client'

import { useEffect, useState } from "react"
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface LoginForm {
    email: string;
    password: string;
  }

export default function Login(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
      });

      const [err, setErr] = useState<string>('')

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
      
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            
            if(res.status == 401){
                setErr(data.message)
            }
            else{
                
                const decode = jwt.decode(data.token) as { user: User };
                console.log(decode.user)
                console.log(data)
                // redirect('/')
                router.push('/');
            }
            
        } catch (error) {
            
        }
      };

    useEffect(() => {
        document.title = 'Login Page'
        if(err){
            const timeoutId = setTimeout(() => {
                setErr('');
                setIsLoading(false)
              }, 3000); 
              return () => clearTimeout(timeoutId); 
        }else{
            setIsLoading(false)
        }
    },[err])

    return(
        // body
        <main className="flex font-poppins items-center justify-center bg-gray-100 dark:bg-gray-900 min-w-screen min-h-screen">
            {/* wrapper */}
            <div>
                
                {err && 
                    <div role="alert" className="mb-3 alert alert-error">
                    <span className="text-white">{err}</span>
                    </div>
                }

                <form onSubmit={handleSubmit} className="card bg-base-100 w-[300px] shadow-xl p-6">
                    <h1 className="card-title">login</h1>
                    
                    <label className="mt-2 mb-3 input input-bordered flex items-center gap-2">Email
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="grow w-0" placeholder="user@test.com" /></label>

                    <label className="mb-3 input input-bordered flex items-center gap-2">Password
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="grow w-0" placeholder="***********" /></label>

                    <button disabled={isLoading} type="submit" className="btn btn-outline">
                        {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'login'}
                    </button>
                </form>
            </div>
        </main>
    )
}