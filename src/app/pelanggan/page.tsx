'use client'
import { FormModal } from "@/components/formModal";
import type { Pelanggan } from "@prisma/client";
import { useEffect, useRef, useState } from "react"

export default function Pelanggan(){
    const [data, setData] = useState<Pelanggan[]>();

    const [pelForm, setPelForm] = useState({
        name: '',
        phone: '',        
    })

    const fmref = useRef<HTMLDialogElement>()
    useEffect(() => {
        async function dataf(){
            try {
                const res = await fetch("/api/pelanggan")
                const dat = await res.json()
                console.log(dat.dat)
                setData(dat.dat)
            } catch (error) {
                
            }
        }

        dataf()
    },[])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target

        setPelForm({ ...pelForm, [name]: value })
    }

    async function submitPel(){
        console.log(pelForm)
        try {
            const res = await fetch('/api/pelanggan',{
                method: "POST",
                body: JSON.stringify(pelForm)
            })
            const resjson = await res.json()
            setData(prev => [...prev?? [], resjson.add ])
            console.log(resjson)
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <div className="p-4">

            <FormModal FMRef={fmref}>
                <h1 className="font-bold text-2xl">Add Pelanggan</h1>

                <label className="form-control w-full mb-4">
                    <div className="label">
                    <span className="label-text">Name</span>
                    </div>
                    <input onChange={handleChange} name="name" type="text" placeholder="Full Name" className="input input-bordered w-full" />
                </label>

                <label className="form-control w-full mb-4">
                    <div className="label">
                    <span className="label-text">Phone Number</span>
                    </div>
                    <input onChange={handleChange} name="phone" type="number" placeholder="Phone Number" className="input input-bordered w-full" />
                </label>

                <form className="flex gap-2 mt-8 justify-end w-full" method="dialog">
            <button className="btn btn-outline w-32">back</button>
            <button onClick={submitPel} className="btn btn-outline btn-success w-32 text-white">Add</button>
          </form>
                </FormModal>

                <button onClick={() =>{
                    fmref.current?.showModal()
                }} className="btn btn-primary mb-4">create</button>

            <h1 className="text-2xl font-bold">Pelanggan</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>phone number</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((p) => (
                    <tr key={p.uid}>
                        <td>{p.name}</td>
                        <td>{p.phoneNumber}</td>
                    </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}