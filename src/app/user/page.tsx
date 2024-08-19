'use client'
import ImageProfile from "@/components/ImageProfile";
import { FormModal } from "@/components/formModal";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

interface UserApprv{
    image?: string,
    email: string,
    uid: string,
    name: string,
    store_name: string,
}

interface Data{
        userApprv: UserApprv[]
        userData: {
            image?: string,
            email: string,
            uid: string,
            name: string,
            store_name: string,
        }[]
}

interface Form{
        username: string,
        store: string,
        password: string,
        email: string,
        image?: File | null
}

export default function User(){
    const formref = useRef<HTMLDialogElement>(null)
    const router = useRouter()
    const [data, setData] = useState<Data>();
    const [form, setForm] = useState<Form>({
        username: '',
        store: '',
        password: '',
        email: '',
        image: null,
    })


    useEffect(() => {
        async function fetchUser(){
            try {
                const user = await fetch("/api/user")            
                const userJson = await user.json()
                setData(userJson)
                console.log(userJson)
            } catch (error) {
                
            }
        }
        fetchUser()
    }, [])

    function handleClickUser(userId: string){
        router.push('/user/'+userId)
    }

    function showFM(){
        if(formref.current){
            formref.current.showModal()
        }
    }

    function handleChangeImg(event: React.ChangeEvent<HTMLInputElement>){
        const file = event.target.files?.[0];
        setForm({...form, [event.target.name]: file})
      }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target

        setForm({...form, [name]: value})
    }

    async function submitForm(){
        console.log(form)
        const formData = new FormData();

        formData.append("email", form.email)
        formData.append("username", form.username)
        formData.append("store", form.store)
        formData.append("isAdmin", "true")
        formData.append("password", form.password)

        try {
            const res = await fetch('/api/auth/register',{
                method: "POST",
                body: formData
              })
              console.log(await res.json())
        } catch (error) {
            console.log(error)
        }
    }

    async function approveUser(userId: string){
        try {
            const res = await fetch('/api/user',{
                method: "PUT",
                body: JSON.stringify(userId)
            })
            const upData: { upUser: UserApprv } = await res.json()
            

        } catch (error) {
            
        }
    }

    return (
        <div className="p-6">
            <FormModal FMRef={formref}>
            <h1 className="font-bold text-2xl">Register User</h1>

            <label className="form-control w-full mb-4">
                <div className="label">
                <span className="label-text">Profile Image</span>
                </div>
                <input onChange={handleChangeImg} name="image" accept=".png, .jpg, .jpeg, .svg" type="file" placeholder="Product" className="file-input file-input-bordered w-full" />
            </label>

            <label className="form-control w-full mb-4">
                <div className="label">
                <span className="label-text">Username</span>
                </div>
                <input onChange={handleChange} name="username" type="text" placeholder="username" className="input input-bordered w-full" />
            </label>

            <label className="form-control w-full mb-4">
                <div className="label">
                <span className="label-text">Store Name</span>
                </div>
                <input onChange={handleChange} name="store" type="text" placeholder="Store Name" className="input input-bordered w-full" />
            </label>

            <label className="form-control w-full mb-4">
                <div className="label">
                <span className="label-text">Email</span>
                </div>
                <input onChange={handleChange} name="email" type="email" placeholder="email" className="input input-bordered w-full" />
            </label>

            <label className="form-control w-full mb-4">
                <div className="label">
                <span className="label-text">Password</span>
                </div>
                <input onChange={handleChange} name="password" type="password" placeholder="******" className="input input-bordered w-full" />
            </label>

            <form className="flex gap-2 mt-8 justify-end w-full" method="dialog">
                <button className="btn btn-outline w-32">back</button>
                <button onClick={submitForm} className="btn btn-outline btn-success w-32 text-white">Add</button>
            </form>

            </FormModal>

            <button onClick={showFM} className="btn btn-success mb-2">Create User</button>

            <div className="flex gap-4">
                {data?.userApprv.map((ua) => (
                    <div key={ua.uid} className="shadow-lg rounded-md p-2 mb-4 w-72">
                        <div>name: {ua.name}</div>
                        <div>store name : {ua.store_name}</div>
                        <div>email: {ua.email}</div>                               
                        <div className="flex justify-end">
                            <button onClick={()=> approveUser(ua.uid)} className="btn btn-sm btn-primary">Appove</button>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-xl font-bold">All Users</h1>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>no</th>
                        <th>Image</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Store Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.userData.map((user, i) => (
                    <tr onClick={()=> handleClickUser(user.uid)} className="hover text-center">
                        <td>{i+1}</td>
                        <td className="flex justify-center"> <ImageProfile username={user.name} isRounded={false} userImage={user.image}/> </td>
                        <td>{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.store_name}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}