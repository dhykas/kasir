import { PrismaClient } from "@prisma/client" 

export async function categorySeeder(name: string, userId: string){
    const prisma = new PrismaClient();

    const category = await prisma.productCategory.create({
        data: {
          name: name,
          UserId: userId
        }
      })
      return category
}