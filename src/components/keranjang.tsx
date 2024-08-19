import { useRef } from "react";
import { KeranjangItem } from "./keranjangItem";
import { Modal } from "./modal";
import { Alert } from "./Alert.tsx";
import { Pelanggan, Product } from "@prisma/client";

interface Data {
  UserId: string,
  name: string,
  products: Product[]
}

interface KeranjangProps{
  keranjang: Keranjang[]
  setKeranjang: any,
  data: Data[],
  setData: any,
  pel: Pelanggan[]
}

export function Keranjang(props: KeranjangProps){
  const { keranjang, setKeranjang, data, setData, pel } = props;

  const modalRef = useRef<HTMLDialogElement>(null);
  const alertRef = useRef<HTMLDialogElement>(null);
  const selRef = useRef<HTMLSelectElement>(null);

  console.log(data)

  function getTotalCount(){
    return keranjang.reduce((acc, product) => acc + (product?.count as number), 0);
  }

  function getTotalPrice(){
    return keranjang.reduce((acc, product) => acc + (product.price as number) * (product.count as number), 0)
  }

  async function order(){
    if(keranjang.length == 0){
      console.log(keranjang)
      if(alertRef.current){
        alertRef.current.showModal()
      }
    }else{
      if (modalRef.current) {
        modalRef.current.showModal();
      }
      
      const pelangganId = selRef.current?.value
      
      try {
            const response = await fetch('/api/transaction',{
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                total_quantity: getTotalCount(),
                total_price: getTotalPrice(),
                keranjang,
                pelangganId
              }),
            });
            const data = await response.json();
            console.log(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }  
    }
    
  }

    return(
        <section className="p-4 card shadow-2xl ml-4 mt-10 w-1/4 ">
          <Modal setKeranjang={setKeranjang} keranjang={keranjang} modalRef={modalRef} />
          <Alert alertRef={alertRef} alertText="This Keranjang Is Empty" />
          <h1 className="font-bold text-xl">Pesanan</h1>
          
          <div className="overflow-auto h-[230px] scroll-smooth">
            {keranjang.length ? (
              keranjang.map((item) => (
                <KeranjangItem keranjang={keranjang} setKeranjang={setKeranjang} key={item.uid} item={item} />
                ))
            ):(
              <div className="w-full h-52 flex justify-center items-center">
                <h1 className="text-gray-400 text-2xl">Keranjang Kosong!</h1>
              </div>
            )}
          </div>

          <div className="mt-2 p-2 border-2 border-gray-300 rounded-xl">
            <div className="flex justify-between">
              <p>Total Item :</p>
              <p>{getTotalCount()}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Price :</p>
              <p>Rp {getTotalPrice().toLocaleString('en')}</p>
            </div>
            {pel?.length !== 0 &&
            <div className="flex justify-between">
              <p>pelanggan : </p>
            {pel?.map((p) => (
              <select ref={selRef} className="select select-sm select-bordered">
                <option disabled selected hidden>Pilih Pelanggan</option>
                <option value={p.uid}>{p.name}</option>
              </select>
            ))}
            </div>
            }
            <button onClick={order} className="w-full mt-4 btn btn-primary">Place Order</button>
          </div>

        </section>
    )
}