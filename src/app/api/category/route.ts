'use server'
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
import { getUserServer } from "@/utils/getUserServer";

const prisma = new PrismaClient();
export async function GET(){
    const user = getUserServer()

    try {
        let getAllCategory = await prisma.productCategory.findMany({
            where: {
                UserId: user.uid
            }
        })

        return NextResponse.json({
            username: user.name,
            data: getAllCategory
        }) 
    } catch (error) {
     return NextResponse.json({
        error
    })    
    }

}

export async function POST(req: Request){
    const body = await req.json()
    const { name } = body
    const user = getUserServer()

    try {
        let createCat = await prisma.productCategory.create({
            data: {
                name,
                UserId: user.uid
            },
            include: {
                products: {
                  where: { userId: user.uid, deletedAt: null },
                  select: { uid: true, name: true, price: true, image: true }, 
                },
              },
        });

        
    return NextResponse.json({
        message: "success create new category",
        createCat
    }) 

    } catch (error) {
        return NextResponse.json({
            error
        })
    }
}