import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET(){

    const userData = await prisma.user.findMany({
        where: {
            isAdmin: false,
            createdAt: {
                not: null
            }
        },
        select: {
            uid: true,
            name: true,
            email: true,
            store_name: true,
            image: true,
        }
    })

    const userApprv = await prisma.user.findMany({
        where: {
            createdAt: null
        }
    })

    return NextResponse.json({
        userData,
        userApprv
    })
}

export async function PUT(req: Request){
    const body = await req.json()

    const time: Date = new Date()

    const upUser = await prisma.user.update({
        where: {
            uid: body
        },
        data: {
            createdAt: time
        }
    })

    return NextResponse.json({
        upUser
    })
}
