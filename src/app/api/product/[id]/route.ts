import normalizeNumber from "@/utils/normalizeNumber";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params } : { params: { id: string } }){
  console.log("update prod")
  const { id } = params
  const data = await req.formData();

  const img = (data.get('image')) as File
  let imgName: string ="";
  console.log("ini img",img)
  console.log(typeof img)
  console.log(img == undefined ? "gada": "ada")

  if(img){
    console.log('ada image')
    imgName = img?.name.replaceAll(" ", "_")
    console.log(imgName)
    const buffer = Buffer.from(await img.arrayBuffer());
    await writeFile(
      path.join(process.cwd(), "public/products/" + imgName),
      buffer
    );
  }

  const updatedData = await prisma.product.update({
    where: {
      uid: id
    },
    data: {
      categoryId: data.get("categoryId") as string,
      name: data.get("name") as string,
      image: imgName,
      price: normalizeNumber(data.get("price") as string),
      stock: parseInt(data.get("stock") as string)
    }
  })

  return NextResponse.json({
    id,
    updatedData
  })
}

export async function DELETE(req: NextRequest, { params } : { params: { id: string } }){
  const { id } = params
  try {
    const deletedProd = await prisma.product.update({
      where: {
        uid: id
      },
      data: {
        deletedAt: new Date()
      }
    })
    return NextResponse.json({
      message: "Successfully deleted record!",
      deletedData: deletedProd
    })

  } catch (error) {
    return NextResponse.json({
      error
    })
  }

}