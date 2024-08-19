import { User } from '@prisma/client';
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken';

export default function getUser(){
    
    const token: string = getCookie('token') as string

    const user = jwt.decode(token) as { user: User }

    return user?.user
}