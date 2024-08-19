'use client'
import { CategorySection } from "@/components/categorySection";
import { CategorySkeleton } from "@/components/categorySkeleton";
import { Keranjang } from "@/components/keranjang";
import { Pelanggan, Product } from "@prisma/client";
import { useEffect, useState } from "react";

interface Data {
  UserId: string,
  name: string,
  products: Product[]
}

export default function Home() {
  const [keranjang, setKeranjang] = useState<Keranjang[]>([]); //bagian sini
  const [data, setData] = useState<Data[]>()
  const [dataPel, setDataPel] = useState<Pelanggan[]>()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/product');
        const data = await response.json();
        setData(data.allCategories);
        setDataPel(data.pel)
        console.log(dataPel)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [])

  return (
    <div>
      <main className="p-4 sm:flex-row flex flex-col-reverse">
        <div className="w-3/4 h-60">
        {data ? 
          <CategorySection setKeranjang={setKeranjang} keranjang={keranjang} data={data} />
         : 
          <CategorySkeleton />
        }
        </div>
        
        <Keranjang pel={dataPel as Pelanggan[]} data={data as Data[]} setData={setData} setKeranjang={setKeranjang} keranjang={keranjang} />
      </main>
    </div>
  );
}
