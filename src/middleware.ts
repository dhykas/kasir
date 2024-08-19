import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from "next/headers";
import jwt, { TokenExpiredError }  from "jsonwebtoken";

export function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname    

    console.log(url)
    const token: string = (cookies().get('token')?.value) as string
    const secret_key = '8d3ur8023rh083h0j83qj&^(&^&)d3*&)%^)YPMIOU*MO&*%*^$(%m8oqqqdh';

    const loginRedirect = NextResponse.redirect(new URL('/login', request.url));

    try {
      if(token && url == "/login"){
        console.log(token)
        console.log("token")
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (!token && url != "/login") {
        return loginRedirect;
      }

      const isValid = jwt.verify(token, secret_key);

      if(!isValid && url != "/login"){
        return loginRedirect;
      }

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return loginRedirect;
      }
      console.error(error)
    }
}

export const config = {
  matcher: ["/", "/product", "/login"]
}