import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function userSeeder(name: string, email: string, password: string, isAdmin: boolean, store_name: string){
    const prisma = new PrismaClient()
    
    const time: Date = new Date()
    const user = await prisma.user.create({
        data: {
          isAdmin: isAdmin,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, 10),
          store_name: store_name,
          createdAt: time
        }
      })
      
    return user
}