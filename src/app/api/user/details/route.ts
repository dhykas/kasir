import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
    const page = parseInt(req.nextUrl.searchParams.get("page") as string)

    const prisma = new PrismaClient()

    const pageSize = 5;
    const pageNumber = page || 1; 
    const skip = (pageNumber - 1) * pageSize;

    const body = await req.json()
    const { userId } = body

    const user = await prisma.user.findUnique({
        where: {
            uid: userId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            },
            transaction: {
                skip: skip,
                take: pageSize
            }
        }
    })

    const totalCount = await prisma.transaction.count({
        where: {
            userId: userId
        }
    });

    return NextResponse.json({
        user,
        totalCount : Math.ceil(totalCount / 5)
    })
}