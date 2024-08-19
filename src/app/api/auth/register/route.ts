import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest){
    const prisma = new PrismaClient()
    const data = await req.formData();

    const img = (data.get('image')) as File

    const email = data.get("email") as string
    const password = data.get("password") as string
    const name = data.get("username") as string
    const store_name = data.get("store") as string
    const isAdmin = data.get("isAdmin") as string
    
    const isAdminBool = isAdmin === "true"

    const time: Date = new Date()
    const reg = await prisma.user.create({
        data:{
            email,
            password: bcrypt.hashSync(password, 10),
            name,
            store_name,
            createdAt: isAdminBool ? time : null
        }
    })

    return NextResponse.json({
        reg,
        img,
        isAdminBool
    })

}