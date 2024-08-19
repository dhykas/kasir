import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const cookieStore = cookies()
    cookieStore.delete('token')


    
    try {
        NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error }, { status: 401 });
    }
    

}