'use client'
// import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname()

    // Check if the current route is "/login" or "/register"
    const isLoginPage = path === '/login';
    const isRegisterPage = path === '/register';
  
    // Render Navbar only if the current route is "/login" or "/register"
    const renderNavbar = isLoginPage || isRegisterPage;

    console.log(path)
  return (
    <html lang="en">
      <body className={inter.className}>
      {!renderNavbar && <Navbar />}
        {children}
        </body>
    </html>
  );
}
