import { getUserServer } from "@/utils/getUserServer";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET(){
    const user = getUserServer()
    const dat = await prisma.pelanggan.findMany({
        where: {
            userId: user.uid
        }
    })

    return NextResponse.json({
        dat
    })
}

export async function POST(req: Request){
    const body = await req.json()
    const { name, phone } = body

    const user =  getUserServer()

    const add = await prisma.pelanggan.create({
        data: {
            name,
            phoneNumber: phone,
            userId: user.uid
        }
    })

    return NextResponse.json({
        body,
        add
    })
}