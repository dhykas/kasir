import Image from "next/image";

interface KeranjangItemProps{
    setKeranjang: any
    keranjang: Keranjang[]
    item: Keranjang
}

export function KeranjangItem({ setKeranjang, keranjang, item } : KeranjangItemProps){
    const { uid, image, name, count, price } = item

    function deleteAllItem(itemId: string) {
        const updatedItems = keranjang.filter(item => item.uid !== itemId);
        setKeranjang(updatedItems);
      }

    return (
        <section className="flex justify-between items-center w-full p-2 mt-2 border-2 border-gray-300 rounded-xl">
            <div className="flex gap-2">
                { image !== null ? <Image className="w-16 rounded-md" src={`/products/${image}`} alt="" width={48} height={48} /> 
                : <div className="w-12 h-12 bg-gray-400 rounded-md"></div> }
                <ul>
                    <li>{name}</li>
                    <li>{`Rp ${price?.toLocaleString('en-EN')} x ${count}`}</li>
                    <li>{`Total : Rp ${(price as number * count as number).toLocaleString('en-En')}`}</li>
                </ul>
            </div>
            <button onClick={() => deleteAllItem((uid) as string)} className="rounded-full p-1 border-2 w-10 flex justify-center items-center h-10 bg-gray-200 border-gray-300">
                <Image width={50} height={50} className="w-full h-full" src='/delete.png' alt={""} />
            </button>
            
        </section>
    )
}