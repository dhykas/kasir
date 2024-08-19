'use client'
import Pagination from "@/components/pagination";
import formatDate from "@/utils/formattedDate";
import { Transaction } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface transactionApi{
    page: number,
    totalPages: number,
    dataCount: number,
    trans: Transaction[]
    transThisMonth: number,
    transLastMonth: number,
    transToday: number
} 

export default function ReportPage(){
    const router = useRouter();
    const tbRef = useRef<HTMLTableElement>(null)
    const selRef1 = useRef<HTMLSelectElement>(null)
    const selRef2 = useRef<HTMLSelectElement>(null)
    const[page, setPage] = useState<number>(1)
    const [data, setData] = useState<transactionApi>()
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await fetch('/api/transaction?page=' + page);
                const datares: transactionApi = await response.json();
                console.log(datares)
                setData(datares)
                
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        }
        fetchdata()
    },[page])

    function handleRedirect(transUid: string){
        router.push('/details-transaction/'+transUid)
    }

    function handleSearch(){
        router.push("/report/"+selRef1.current?.value+"/"+selRef2.current?.value)
    }

    return(
        <>
            <main className="px-10 pt-4">
                <div className="flex gap-2">
                    <div className="card shadow xl p-4 w-1/3">
                        Transaksi Bulan Lalu
                        <span className="font-bold font-2xl">{data?.transLastMonth}</span>
                    </div>
                    <div className="card shadow xl p-4 w-1/3">
                        Transaksi Bulan Ini
                        <span className="font-bold font-2xl">{data?.transThisMonth}</span>
                    </div>
                    <div className="card shadow xl p-4 w-1/3">
                        Transaksi Hari Ini
                        <span className="font-bold font-2xl">{data?.transToday}</span>
                    </div>
                </div>

                <div className="p-2 flex gap-2">    
                    <select ref={selRef1} className="select select-bordered" name="month">
                        <option value="2">Feb</option>
                        <option value="3">Mar</option>
                        <option value="4">Apr</option>
                    </select>
                    <select ref={selRef2} className="select select-bordered" name="year" >
                        <option value="2024">2024</option>
                    </select>
                    <button onClick={handleSearch}className="btn btn-primary">Search</button>
                </div>

                <div className="h-[300px] w-1/2 border-[3px] border-gray-300 rounded-lg">
                    <table ref={tbRef} className="table">
                        <thead>
                        <tr className="text-center text-lg">
                            <th></th>
                            <th>Date</th>
                            <th>Total Quantity</th>
                            <th>Total Item</th>
                        </tr>
                        </thead>

                        <tbody>
                            {data?.trans.map((child, i) => (
                                <tr onClick={() => handleRedirect(child.uid)} key={child.uid} className="hover text-center cursor-pointer">
                                    <th>{i+1}</th>
                                    <td>{formatDate(child.createdAt)}</td>
                                    <td>{child.total_price.toLocaleString('en-US')}</td>
                                    <td>{child.total_quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 flex justify-center mt-4">
                        <Pagination currentPage={page} setPages={setPage} totalPages={data?.totalPages as number} />
                </div>
            </main>
        </>
    )
}