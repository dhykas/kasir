'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient, User} from '@prisma/client';
import { writeFile } from "fs/promises";
import path from "path";
import { getUserServer } from '@/utils/getUserServer';
import normalizeNumber from '@/utils/normalizeNumber';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.formData();
  
  const user = getUserServer()

  // problem nama img sama
  // validasi all input dan validasi img(jika all input kosong dan img ada)
  const img = (data.get('image')) as File
  const imgName = img?.name.replaceAll(" ", "_")
  try {
    if(img){
      console.log('ada image coyyyyy')
      const buffer = Buffer.from(await img.arrayBuffer());
      await writeFile(
        path.join(process.cwd(), "public/products/" + imgName),
        buffer
      );
    }
  
    const formatedPrice = normalizeNumber(data.get('price') as string) 

    const newProd = await prisma.product.create({
      data: {
        stock: Number(data.get("stock")),
        name: (data.get('name')) as string,
        price: formatedPrice as number,
        image: imgName,
        categoryId: (data.get('categoryId')) as string,
        userId: user.uid      
      },
      include: {
        category: true
      }
    }) 

    return NextResponse.json({
      message: "successfully add new product",
      newProd
    })
  } catch (error) {
    NextResponse.json({error})
  }
}

export async function GET(req: NextRequest) {
  const tokenUser = req.cookies.get('token')?.value ?? '';
  const secret_key = '8d3ur8023rh083h0j83qj&^(&^&)d3*&)%^)YPMIOU*MO&*%*^$(%m8oqqqdh';

  const decoded = jwt.verify(tokenUser, secret_key) as { user: User };
  try {

    const allCategories = await prisma.productCategory.findMany({
      where: {
        OR: [
          { products: { some: { userId: decoded.user.uid, deletedAt: null } } },
          { products: { none: {} } } // Include categories without any products
        ]
      },
      include: {
        products: {
          where: { userId: decoded.user.uid, deletedAt: null },
          select: { uid: true, name: true, price: true, image: true, categoryId: true, stock: true }, 
        },
      },
    });

    const pel = await prisma.pelanggan.findMany({
      where : {
        userId: decoded.user.uid
      }
    })
    

    return NextResponse.json({
      allCategories,
      pel
    });
  } catch (error) {
    // req.cookies.set('token', '')
    // return NextResponse.json({ decoded })
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
