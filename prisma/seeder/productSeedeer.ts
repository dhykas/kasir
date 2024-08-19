import { PrismaClient } from "@prisma/client";

export async function productSeeder(userId : string, categoryId : string, count: number){
  const prisma = new PrismaClient()
  const products = [];
  for (let i = 1; i <= count; i++) {
    products.push({
      name: `product ${i}`,
      price: 10000,
      userId: userId,
      categoryId: categoryId,
      stock: 10
    })
  }

    const createdProducts = await prisma.product.createMany({
      data: products,
    })
}