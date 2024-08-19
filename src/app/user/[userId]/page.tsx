'use client'
import Pagination from "@/components/pagination"
import formatDate from "@/utils/formattedDate"
import { stringToRp } from "@/utils/stringToRp"
import { Product, ProductCategory, Transaction, User } from "@prisma/client"
import { useEffect, useState } from "react"

interface Data{
    user: User & { product: (Product & { category: ProductCategory })[] , transaction: Transaction[] }
    totalCount: number
}

export default function detailUser({ params }: { params: { userId: string } }){
    const { userId } = params
    const [data, setData] = useState<Data>()

    const [page, setPage] = useState<number>(1)
    useEffect(() => {
        async function fetching(){
            try {
                const res = await fetch(`/api/user/details?page=${page}`,{
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId
                    })
                })

                const resData = await res.json()
                if(resData){
                    setData(resData)
                }
            } catch (error) {

            }
        }
        fetching()
    },[page])

    console.log(data)

    return(
        <div className="p-4">
            <h1 className="text-xl font-bold">Product</h1>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th></th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.user.product.map((p,i) => (
                    <tr className="text-center" key={p.uid}>
                        <td>{i+1}</td>
                        <td>image</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.category.name}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <h1 className="mt-8 text-xl font-bold">Transaction</h1>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th></th>
                        <th>Created at</th>
                        <th>price</th>
                        <th>quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.user.transaction.map((t,i) => (
                    <tr className="text-center" key={t.uid}>
                        <td>{i+1}</td>
                        <td>{formatDate(t.createdAt)}</td>
                        <td>{stringToRp(t.total_price.toString())}</td>
                        <td>{t.total_quantity} Pcs</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={page} setPages={setPage} totalPages={data?.totalCount as number} />
        </div>
    )
}