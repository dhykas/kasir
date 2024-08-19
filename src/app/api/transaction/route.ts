import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers';
import { PrismaClient, User } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { getUserServer } from "@/utils/getUserServer";

const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const page = parseInt(req.nextUrl.searchParams.get("page") as string)

    const user = getUserServer()

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

        // Use currentDate in your Prisma query
        const transToday = await prisma.transaction.count({
            where: {
                userId: user.uid,
                createdAt: {
                    gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                    lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
                }
            }
        });

    // Count transactions for the current month
    const transThisMonth = await prisma.transaction.count({
        where: {
            userId: user.uid,
            AND: {
                createdAt: {
                    gte: new Date(currentDate.getFullYear(), currentMonth, 1), // Start of the current month
                    lt: new Date(currentDate.getFullYear(), currentMonth + 1, 1) // Start of next month
                }
            }
        }
    });

    // Count transactions for the previous month
    const transLastMonth = await prisma.transaction.count({
        where: {
            userId: user.uid,
            AND: {
                createdAt: {
                    gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1), // Start of the previous month
                    lt: new Date(currentDate.getFullYear(), currentMonth, 1) // Start of the current month
                }
            }
        }
    });


    const pageSize = 5;
    const pageNumber = page || 1; 
    const skip = (pageNumber - 1) * pageSize;

    const trans = await prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc"
        },
        where: {
            userId: user.uid
        },
        skip: skip,
        take: pageSize
    })

    const totalCount = await prisma.transaction.count({
        where: {
            userId: user.uid
        }
    });
    
    const totalPages = Math.ceil(totalCount / pageSize);

    console.log('page: '+page)
    return NextResponse.json({
        page,
        totalPages,
        dataCount: totalCount,
        trans,
        transThisMonth,
        transLastMonth,
        transToday
    })
}

export async function POST(req: Request){
    const body = await req.json()
    const { total_quantity, total_price, keranjang, pelangganId } = body
    
    const secret_key = '8d3ur8023rh083h0j83qj&^(&^&)d3*&)%^)YPMIOU*MO&*%*^$(%m8oqqqdh';
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value ?? "";
    const decoded = jwt.verify(token, secret_key) as { user: User };

    const new_trans = await prisma.transaction.create({
        data: {
            userId: decoded.user.uid,
            total_price: total_price,
            total_quantity: total_quantity,
            pelangganId
        },
    })

    let pivot: { quantity: number; productId: string; transactionId: string, productPrice: number ; }[] = []

    keranjang.map(async (prod: Keranjang) => {
        pivot.push({
            quantity: (prod.count as number),
            productId: (prod.uid as string),
            transactionId: (new_trans.uid as string),
            productPrice: prod.price as number
        })
    })

    await prisma.productTransaction.createMany({
        data: pivot
    })

    return NextResponse.json({
        new_trans,
        pivot,
        total_price,
        total_quantity,
        keranjang,
        user: decoded.user,
    })
}