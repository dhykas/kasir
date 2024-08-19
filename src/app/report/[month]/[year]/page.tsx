'use client'
import formatDate from "@/utils/formattedDate"
import { Product, ProductTransaction } from "@prisma/client"
import { useEffect, useRef, useState } from "react"

import { utils, writeFileXLSX } from "xlsx";
interface Data{
    dataMonYear: ProductTransaction[] & { product: Product }
}

export default function reportMonthly({ params }: { params: { month: string, year: string } }){
    const [data, setData] = useState<Data>()
    const { month, year } = params
    const tbRef = useRef<HTMLTableElement>(null)

    useEffect(() => {
        async function ftch(){
            try {
                const res = await fetch("/api/transByMonth", {
                    method: "POST",
                    body: JSON.stringify({month,year})
                })
                const rejson = await res.json()
                console.log(rejson)
                setData(rejson)

            } catch (error) {
                
            }
        }
        ftch()
    },[])


    
    async function handleExport() {
        if (tbRef.current) {
          // generate workbook from table element
          const wb = utils.table_to_book(tbRef.current);          
          const ws = wb.Sheets[wb.SheetNames[0]];
          ws['!cols'] = Array(ws['!ref'].split(':')[1].charCodeAt(0) - ws['!ref'].split(':')[0].charCodeAt(0) + 1).fill({ width: 15 });

        // Center align all cells
        const range = ws['!ref'];
        const cells = utils.decode_range(range);
        for (let R = cells.s.r; R <= cells.e.r; ++R) {
            for (let C = cells.s.c; C <= cells.e.c; ++C) {
                const cellRef = utils.encode_cell({ c: C, r: R });
                if (!ws[cellRef]) continue;
                ws[cellRef].s = {
                    alignment: {
                        horizontal: 'center'
                    }
                };
            }
        }

        // Make cells in the first column bold
        for (let R = cells.s.r; R <= cells.e.r; ++R) {
            const firstCellRef = utils.encode_cell({ c: cells.s.c, r: R });
            if (!ws[firstCellRef].s) ws[firstCellRef].s = {}; // Initialize styles object if it doesn't exist
            ws[firstCellRef].s.font = { bold: true }; // Set font to bold
        }

        // write to XLSX
        writeFileXLSX(wb, `Report ${month} - ${year}.xlsx`);
          }
    }

    return (
        <div className="p-4">
            <p>bulan ke: {month} dan tahun yang ke {year}</p>
            <button className="btn btn-success" onClick={handleExport}>export excel</button>

            <table ref={tbRef} className="table">
                <thead>
                <tr className="text-center">
                    <th>no</th>
                    <th>created at</th>
                    <th>Name</th>
                    <th>total quantity</th>
                    <th>total price</th>
                </tr>
                </thead>
                <tbody>
                    {data?.dataMonYear.map((t,i) => (
                    <tr className="hover text-center">
                        <td>{i+1}</td>                        
                        <td>{formatDate(t.createdAt)}</td>
                        <td>{t.product.name}</td>
                        <td>{t.quantity} pcs</td>
                        <td>{t.productPrice}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}