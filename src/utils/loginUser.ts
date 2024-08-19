import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { 
        email,
        createdAt: {
          not: null
        }
       },
    });
  
    if (!user) {
      console.log(user)
      throw new Error('Invalid credentials no user');
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      throw new Error('Invalid credentials pw no match');
    }
   
  
    const secret_key = "8d3ur8023rh083h0j83qj&^(&^&)d3*&)%^)YPMIOU*MO&*%*^$(%m8oqqqdh"
    const token = jwt.sign({ user }, secret_key, {
      expiresIn: '7h', // Set expiration time for the token
    });
  
    return token
  }
  