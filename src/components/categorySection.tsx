import { Product } from "@prisma/client"
import { ProductComponent } from "./productComponent";

interface Data {
    UserId: string,
    name: string,
    products: Product[]
  }

  interface CategoryProps {
    data: Data[] | undefined;
    keranjang: Keranjang[] | undefined[];
    setKeranjang: any

    setData?: any,
    deleteProdFunc?: any
    confRef?: any
    showModalDelete?: any,
    showModalEdit?: any
  }

export function CategorySection(props: CategoryProps){
    const { showModalDelete, showModalEdit, data, keranjang, setKeranjang, confRef } = props;

    console.log(data)
    return(
        <>
        {data?.length !== 0 ? (
            data?.map((category, i) => (
                <div key={i}>
                    <h1 className="mb-2 font-bold text-2xl">{category.name} {category.products.length == 0 && (<span className="text-sm text-gray-400">*This category is empty. Add new products.</span>)} </h1>
                    <ProductComponent showModalEdit={showModalEdit} ShowModalDelete={showModalDelete} confRef={confRef} setKeranjang={setKeranjang} keranjang={keranjang} products={category.products} />
                </div>
            ))
            ) : (
            <p className="w-80 text-gray-500">There is no product here, add category and product at the product section</p>
            )}
        </>
    )
}
