'use client'

import { Alert } from "@/components/Alert.tsx";
import { Conf } from "@/components/Confirming";
import { CategorySection } from "@/components/categorySection";
import { CategorySkeleton } from "@/components/categorySkeleton";
import { FormModal } from "@/components/formModal";
import { stringToRp } from "@/utils/stringToRp";
import { Product, ProductCategory } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Data {
    UserId: string
    uid: string
    name: string
    products: Product[]
  }

  interface Prod{
    name: string
    prodId: string
  }

  interface ProdForm{
    name: string
    price: string
    categoryId: string
    image?: File | null
    stock: number
  }

export default function ProductPage(){
  const [alertText, setAlertText] = useState<string>('')
  const [data, setData] = useState<Data[]>()
  const [category, setCategory] = useState<ProductCategory[]>()
  const [keranjang, setKeranjang] = useState<Keranjang[]>([]); //bagian sini
  const [prod, setProd] = useState<Prod>()
  const [catInput, setCatInput] = useState('')
  const [prodForm, setProdForm] = useState<ProdForm>({
    name: '',
    stock: 0,
    price: '',
    categoryId: '',
    image: null,
  })
  const [editForm, setEditForm] = useState<ProdForm & { uid: string }>({
    uid: '',
    name: '',
    price: '',
    categoryId: '',
    image: null,
    stock: 0
  })

  const confRef = useRef<HTMLDialogElement>(null)
  const CatRef = useRef<HTMLDialogElement>(null)
  const ProdRef = useRef<HTMLDialogElement>(null)
  const alerRef = useRef<HTMLDialogElement>(null)
  const editRef = useRef<HTMLDialogElement>(null)
  const editFormRef = useRef<HTMLFormElement>(null)

  const curPath = usePathname();

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('/api/product');
        const data = await response.json();
        setData(data.allCategories);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch('/api/category');
        const allCat = await response.json();
        setCategory(allCat.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
  
    fetchCategory();
  }, []);

  function handleChangeCat(event: React.ChangeEvent<HTMLInputElement>){
    setCatInput(event.target.value)
  }

  function handleChangeProd(event: React.ChangeEvent<HTMLInputElement>, isEdit?: boolean){
    const { name, value } = event.target

    if(name === "price"){
      const formattedValue = stringToRp(value)
      if(!isEdit){setProdForm({...prodForm, [name]: formattedValue})}else{setEditForm({...editForm, [name]: formattedValue})}
      return
    }    
    if(!isEdit){setProdForm({...prodForm, [name]: value})}else{setEditForm({...editForm, [name]: value})}
  }

  function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>, isEdit?: boolean){
    if(!isEdit){setProdForm({...prodForm, [event.target.name]: event.target.value})}else{setEditForm({...editForm, [event.target.name]: event.target.value})}
  }

  function handleChangeImg(event: React.ChangeEvent<HTMLInputElement>, isEdit?: boolean){
    const file = event.target.files?.[0];
    if(!isEdit){setProdForm({...prodForm, [event.target.name]: file})}else{setEditForm({...editForm, [event.target.name]: file})}
  }

  async function submitEdit(){

    if (!editFormRef.current) return;

    const FD = new FormData(editFormRef.current);

    const datata = Object.fromEntries(FD.entries()) as Record<string, string>;

    console.log('Form Data:', datata);
    console.log('Form Data:', datata.categoryId);
    console.log('Form Data:', datata.name);

    if(editForm.categoryId == ''){
      if(alerRef.current){
        setAlertText('Category Is Required')
        alerRef.current.showModal()
      }
      return
    }else if(editForm.name == ''){
      if(alerRef.current){
        setAlertText('Name Is Required')
        alerRef.current.showModal()
      }
      return
    }else if(editForm.price == ''){
      if(alerRef.current){
        setAlertText('Price Is Required')
        alerRef.current.showModal()
      }
      return
    }else if (editForm.stock < 0){
      if(alerRef.current){
        setAlertText('Stock cant be minus')
        alerRef.current.showModal()
      }
      return
    }

    // const formData = new FormData();

    // formData.append('name', editForm.name);
    // formData.append('price', editForm.price);
    // formData.append('image', editForm.image as File);
    // formData.append('categoryId', editForm.categoryId);
    // formData.append('stock', editForm.stock.toString());
    
    try {
      const res = await fetch('/api/product/'+editForm.uid, {
        method: "PUT",
        body: formData
      })

      const datares: { updatedData: Product } = await res.json()
      const upData = datares.updatedData;

      const updatedData = data?.map(dataItem => {
        if (dataItem.uid === upData.categoryId) {
            const updatedProducts = dataItem.products.map(product => {
                if (product.uid === upData.uid) {
                    return upData;
                } else {
                    return product;
                }
            });
            
            return {
                ...dataItem,
                products: updatedProducts
            };
        } else {
            return dataItem;
        }
    });

      console.log(upData)
      console.log(data)
      console.log(updatedData)
      setData(updatedData);


    } catch (error) {
      
    }
  }

  async function submitProd(){
    if(prodForm.categoryId == ''){
      if(alerRef.current){
        setAlertText('Category Is Required')
        alerRef.current.showModal()
      }
      return
    }else if(prodForm.name == ''){
      if(alerRef.current){
        setAlertText('Name Is Required')
        alerRef.current.showModal()
      }
      return
    }else if(prodForm.price == ''){
      if(alerRef.current){
        setAlertText('Price Is Required')
        alerRef.current.showModal()
      }
      return
    }else if(prodForm.stock == 0){
      if(alerRef.current){
        setAlertText('Stock Is Required')
        alerRef.current.showModal()
      }
      return
    }

    const formData = new FormData();

    formData.append('name', prodForm.name);
    formData.append('price', prodForm.price);
    formData.append('stock', prodForm.stock.toString());
    formData.append('categoryId', prodForm.categoryId);

    if (prodForm.image) {
      formData.append('image', prodForm.image);
    }

    try {
      console.log(prodForm)
      const res = await fetch('/api/product', {
        method: "POST",
        body: formData
      })
      const datares: { message: string, newProd: Product } = await res.json()
      
      const updatedData = data?.map(specData => {
        if (specData.uid === datares.newProd.categoryId) {
          return {
            ...specData,
            products: [...specData.products, datares.newProd]
          };
        } else {
          return specData; 
        }
      });      

      setData(updatedData)
    } catch (error) {
      
    }
  }

  async function submitCat(){
    if(catInput == '' || catInput === undefined || catInput === null){
      setAlertText('invalid input (the text input is required)')
      if(alerRef.current){
        alerRef.current.showModal() 
      }
      return
    }
    const res = await fetch('/api/category',{
      method: "POST",
      body: JSON.stringify({
        name: catInput,
      })
    })
    const response: {
      message: string,
      createCat: {
        uid: string,
        name: string,
        UserId: string,
        products: Product[]      
      }
    } = await res.json()

    setData(prev => [...prev?? [],response.createCat ])
    setCategory(prev => [...prev?? [], {
      uid: response.createCat.uid,
      name: response.createCat.name,
      UserId: response.createCat.UserId
    }])
    setCatInput('')
  }

    async function deleteProd(prod: Prod){
      try {
        const response = await fetch(`/api/product/${prod.prodId}`, {
          method: "DELETE",
        });
        console.log(await response.json())

      } catch (error) {
        console.log(error)
      } finally {
          const newData = data?.map(item => ({
              ...item,
              products: item.products.filter(product => product.uid !== prod.prodId)
            }));    
            setData(newData)
      }
    }

    function ShowModalDelete(prod : Prod){
      setProd({
        name: prod.name,
        prodId: prod.prodId
      })
      if(confRef.current){
        confRef.current.showModal()
      }
    }

    function showModalEdit(prod: ProdForm & { uid: string }){
      if(editRef.current){
        editRef.current.showModal()
      }
      console.log(editForm)
      setEditForm({
        uid: prod.uid,
        name: prod.name,
        categoryId: prod.categoryId,
        price: prod.price,
        image: prod.image,
        stock: prod.stock
      })
    }

    return(
        <>
        {curPath === '/product' && <Alert alertRef={alerRef} alertText={alertText} />}
        {curPath === '/product' && <Conf btnfunc={() => deleteProd(prod as Prod)} btnText="Delete" text={`Are You Sure Want To Delete ${prod?.name}?`} btnClass="btn-error text-white" confRef={confRef} />}          

        {curPath === '/product' && 
        <FormModal FMRef={CatRef}>
          <h1 className="font-bold text-2xl">Add Category</h1>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Category Name</span>
            </div>
            <input value={catInput} onChange={handleChangeCat} type="text" placeholder="Category" className="input input-bordered w-full" />
          </label>

            <form className="flex gap-2 mt-8 justify-end w-full" method="dialog">
              <button className="btn w-32">back</button>
              <button onClick={submitCat} className="btn btn-success w-32 text-white">Add</button>
            </form>
        </FormModal>
        }       

        {curPath === '/product' && 
        <FormModal FMRef={ProdRef}>
          <h1 className="font-bold text-2xl">Add Product</h1>

          <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Category</span>
          </div>
          <select value={prodForm.categoryId} onChange={handleChangeSelect} name="categoryId" className="select select-bordered">
            <option hidden disabled value=''>Category</option>
            {category?.map((cate,i) => (
              <option value={cate.uid} key={i} >{cate.name}</option>  
            ))}
          </select>
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Image</span>
            </div>
            <input onChange={handleChangeImg} name="image" accept=".png, .jpg, .jpeg, .svg" type="file" placeholder="Product" className="file-input file-input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Name</span>
            </div>
            <input value={prodForm.name} onChange={handleChangeProd} name="name" type="text" placeholder="Product" className="input input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Stock</span>
            </div>
            <input value={prodForm.stock} onChange={handleChangeProd} name="stock" type="number" placeholder="Stock" className="input input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Price</span>
            </div>
            <input value={prodForm.price} onChange={handleChangeProd} name="price" type="text" placeholder="Rp. 10xxx" className="input input-bordered w-full" />
          </label>

          <div>
          <form className="flex gap-2 mt-8 justify-end w-full" method="dialog">
            <button className="btn btn-outline w-32">back</button>
            <button onClick={submitProd} className="btn btn-outline btn-success w-32 text-white">Add</button>
          </form>
          </div>
        </FormModal>
        }       

        {curPath === '/product' && 
        <form ref={editFormRef}>
        <FormModal FMRef={editRef}>
          <h1 className="font-bold text-2xl">Edit Product</h1>

          <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Category</span>
          </div>
          <select onChange={(e) => handleChangeSelect(e, true)} name="categoryId" className="select select-bordered">
            <option hidden disabled value=''>Category</option>
            {category?.map((cate,i) => (
              <option selected={cate.uid == editForm.categoryId} value={cate.uid} key={i} >{cate.name}</option>  
            ))}
          </select>
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Image</span>
            </div>
            <input onChange={(e) => handleChangeImg(e, true)} name="image" accept=".png, .jpg, .jpeg, .svg" type="file" placeholder="Product" className="file-input file-input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Name</span>
            </div>
            <input value={editForm.name} onChange={(e) => handleChangeProd(e, true)} name="name" type="text" placeholder="Product" className="input input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Stock</span>
            </div>
            <input value={editForm.stock} onChange={(e) => handleChangeProd(e, true)} name="stock" type="number" placeholder="Stock" className="input input-bordered w-full" />
          </label>

          <label className="form-control w-full mb-4">
            <div className="label">
              <span className="label-text">Product Price</span>
            </div>
            <input value={editForm.price} onChange={(e) => handleChangeProd(e, true)} name="price" type="text" placeholder="Rp. 10xxx" className="input input-bordered w-full" />
          </label>

          <div>
          <form className="flex gap-2 mt-8 justify-end w-full" method="dialog">
            <button className="btn btn-outline w-32">back</button>
            <button onClick={submitEdit} className="btn btn-outline btn-warning w-32 text-white">Edit</button>
          </form>
          </div>
        </FormModal>
        </form>
        }       

        <div className="p-6">
        <div className="flex gap-2 mb-2">
          <button onClick={() => { CatRef.current?.showModal() }} className="btn btn-success text-white">Add Category</button>
          <button onClick={() => { ProdRef.current?.showModal() }} className="btn btn-success text-white">Add Product</button>
        </div>
        {data ? 
          <CategorySection showModalEdit={showModalEdit} showModalDelete={ShowModalDelete} confRef={confRef} deleteProdFunc={deleteProd} setData={setData} setKeranjang={setKeranjang} keranjang={keranjang} data={data} />
         : 
          <CategorySkeleton />
        }
        </div>
        </>
    )
}