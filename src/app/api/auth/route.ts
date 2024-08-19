"use server"
import loginUser from "@/utils/loginUser";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json()

  const { email, password } = body

  try {
    const token = await loginUser(email, password);
    const sevDay = 7 * 24 * 60 * 60 * 1000; 
    const expirationTime = Date.now() + sevDay; 

    cookies().set('token', token,
    //  { expires: new Date(expirationTime) }
     );

    return NextResponse.json({token, exp: new Date(expirationTime), now: Date.now()})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
