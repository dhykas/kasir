'use client'

import formatDate from "@/utils/formattedDate"
import { Transaction, ProductTransaction, Product, Pelanggan } from "@prisma/client"
import { useEffect, useState } from "react"

interface Details{
    detail: Transaction & 
    { productTransaction: (ProductTransaction & { product: Product })[],
      pelanggan : Pelanggan
  }
}

export default function Page({ params }: { params: { transId: string }}){
    const [data, setData] = useState<Details>()
    const transId = params.transId
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('/api/transaction/'+transId);
              const resData = await response.json();
              setData(resData);
              console.log(resData)
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
          
          fetchData();
    },[])

    let dataToPrint: string = '';
    dataToPrint+= `Transaction Date : ${formatDate(data?.detail.createdAt as Date)}` + '\n'
    dataToPrint+= `Total Price : Rp. ${data?.detail.total_price.toLocaleString("en-EN")}` + '\n'
    dataToPrint+= `Total Quantity Product : ${data?.detail.total_quantity} Pcs` + '\n'
    async function printData(){
      console.log(dataToPrint)
      try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
        });

        const server = await device?.gatt?.connect() ?? null;
        if (server) {
            const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb') ?? null;
            if (service) {
                const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb') ?? null;
                if (characteristic) {
                    await characteristic.writeValue(new TextEncoder().encode(dataToPrint));
                } else {
                    console.error('Failed to get characteristic.');
                }
            } else {
                console.error('Failed to get service.');
            }
            server.disconnect();
        } else {
            console.error('Failed to connect to the Bluetooth device.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
    }

    return (
        <div className="p-6 flex gap-4">
            <div className="rounded-md shadow-lg p-4 w-1/2">
                <p>Transaction Date : {formatDate(data?.detail.createdAt as Date)}</p>
                <p>Total Price : Rp. {data?.detail.total_price.toLocaleString("en-EN")}</p>
                <p>Total Quantity Product : {data?.detail.total_quantity} Pcs</p>
                {data?.detail.pelanggan && <p>Nama Pelanggan : {data?.detail.pelanggan.name}</p>}
                
                <button onClick={printData} className="float-end btn btn-primary">Print Receipt</button>
            </div>
            <div className="rounded-md shadow-lg p-4 w-1/2">
            <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Price</th>
        <th>quantity</th>
      </tr>
    </thead>

    <tbody>
    {data?.detail.productTransaction.map((pt, i) => (
        <tr>
            <td>*</td>
            <td>{pt.product.name}</td>
            <td>Rp. {pt.product.price.toLocaleString('en-EN')}</td>
            <td>{pt.quantity}</td>
        </tr>
    ))}
    </tbody>
  </table>
            </div>
        </div>
    )
    
}