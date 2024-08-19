import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const prisma = new PrismaClient()
    const body = await req.json()
    const { month, year } = body

    const startDate = new Date(year, month - 1, 1); // Note: month is zero-based index in JavaScript Date object
    const endDate = new Date(year, month, 0); // Last day of the month

    const dataMonYear = await prisma.productTransaction.findMany({
        // skip: 1,
        // take: 5,
        include: {
            product: true
        },
        where: {
            AND: [
                {
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    }
                }
            ]
        }
    });

    

    return NextResponse.json({
      startDate,
      endDate,
      dataMonYear
    })
}