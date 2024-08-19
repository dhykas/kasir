import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function getUserServer(){
    
    const cookieStore = cookies()

    const token = (cookieStore.get('token')?.value ?? "") as string

    const user = jwt.decode(token) as { user: User }

    return user.user
}