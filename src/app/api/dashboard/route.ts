import { getUserServer } from "@/utils/getUserServer";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(){
    
    const user = getUserServer()

    const transaction = await prisma.transaction.findMany({
        where: { userId: user.uid },
        include: {
            productTransaction: true
        }
    })
    
    // const prod = await prisma.product.findMany({
    //     where: { userId: user.uid },
    //     include: {
    //         category: true,
    //     }
    // })

    // const cat = await prisma.productCategory.findMany({
    //     where: { UserId: user.uid },
    //     include: {
    //         products: true
    //     }
    // })

    return NextResponse.json({
        transaction,
        // cat,
        // prod
    })
}