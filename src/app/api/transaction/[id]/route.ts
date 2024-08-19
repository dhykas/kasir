import { getUserServer } from "@/utils/getUserServer";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params } : { params: { id: string } }){
    const user = getUserServer()
    const { id } = params

    const prisma = new PrismaClient()
    
    const detail = await prisma.transaction.findUnique({
        where: {
            userId: user.uid,
            uid: id
        },
        include: {
            pelanggan: true,
            productTransaction: {
                include: {
                    product: true,
                }
            }
        }
    })

    return NextResponse.json({
        message: "get details",
        detail,
    })
    }