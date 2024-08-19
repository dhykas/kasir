import { stringToRp } from "@/utils/stringToRp";
import { Product } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ProductProps {
    products: Product[]
    keranjang: Keranjang[] | undefined[]
    // setKeranjang: React.Dispatch<React.SetStateAction<Keranjang[]>>; //sini pake ?
    setKeranjang: any
    confRef: any
    ShowModalDelete: any
    showModalEdit?: any
}

export function ProductComponent(props : ProductProps){
    const { showModalEdit, products, keranjang, setKeranjang, ShowModalDelete, confRef } = props;
    const curPath = usePathname();

    function removeKeranjang(prod: Product) {
      const existingItemIndex = keranjang.findIndex(item => item?.uid === prod.uid);
  
      if (existingItemIndex !== -1) {
        const updatedItems: Keranjang[] = ([...keranjang] as Keranjang[]);
        if (updatedItems[existingItemIndex].count === 1) {
          updatedItems.splice(existingItemIndex, 1);
        } else {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            count: (updatedItems[existingItemIndex].count || 0) - 1
          };
        }
        setKeranjang(updatedItems);
      }
    }

    function addToKeranjang(prod: Product) {
      console.log(prod);
      const existingItemIndex = keranjang?.findIndex((item) => item?.uid === prod.uid);
    
      if (existingItemIndex !== -1) {
        const updatedItems: Keranjang[] = (keranjang.filter(Boolean) as Keranjang[]);
        const existingItem = updatedItems[existingItemIndex];
        
        // Check if existingItem is not undefined and if existingItem.count is not undefined
        if (existingItem && typeof existingItem.count === 'number' && existingItem.count < prod.stock) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            count: existingItem.count + 1,
          };
          setKeranjang(updatedItems);
        } else {
          // Notify user that adding more will exceed stock or item not found
          console.log("Cannot add more, exceeds available stock or item not found");
        }
      } else {
        setKeranjang([...keranjang, { ...prod, count: 1 }]);
      }
    }
    

    function isInKeranjang(itemId : string) {
      return keranjang.some(item => item?.uid === itemId);
    }

    return (
        <div className={`grid gap-6 ${curPath !== '/' ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>          
            {products.map((prod, i) => (
                <div key={i} className="card w-[280px] bg-base-100 shadow-xl">
                <figure>
                  {prod.image ? (
                    <div className="bg-cover h-36 w-full">
                      <Image priority src={`/products/${prod.image}`} alt="product" width={1000} height={144} />
                    </div>
                    ): (
                      <div className="h-36 w-full bg-gray-300"></div>
                  )}
                </figure>
                <div className="p-4 card-body">
                  <h2 className="card-title">{prod.name} | {prod.stock}</h2>
                  <p>Rp. {prod.price.toLocaleString('en-US')}</p>
                  <div className={`card-actions ${isInKeranjang(prod.uid) ? "" : "justify-end"}`}>
                  {isInKeranjang(prod.uid) ? (
                    <div className="flex gap-2">
                      <button className="btn btn-error" onClick={() => removeKeranjang(prod)}>Subtract Item</button>
                      <button className="btn btn-success text-white" onClick={() => addToKeranjang(prod)}>Add More</button>
                    </div>
                  ):(
                    curPath !== '/product' ? prod.stock !== 0 ? <button onClick={() => addToKeranjang(prod)} className="btn btn-primary">Buy Now</button> : 
                    <p className="text-error"> product is sold, please restock</p>
                    :
                    <div className="flex gap-2">
                      <button className="btn btn-warning text-white w-20 h-1" onClick={() => showModalEdit({ uid: prod.uid, name: prod.name, price: stringToRp(prod.price.toString()), categoryId: prod.categoryId, stock: prod.stock })}>edit</button>
                      <button className="btn btn-error text-white w-20" onClick={() => ShowModalDelete({ name: prod.name, prodId: prod.uid })}>delete</button>
                    </div>
                    
                  )}
                  </div>
                </div>
              </div>
            ))}
        </div>
    )
}