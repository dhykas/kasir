'use client'
import getUser from '@/utils/getUserByToken';
import { useRouter } from 'next/navigation';
// import ImageProfile from './ImageProfile';

function getInitials(name: string) {
  const words = name?.split(" ");
  const initials = words?.map(word => word.charAt(0).toUpperCase());
  return initials?.join("");
}

const linkList: { href: string, name:string, isAdmin?:boolean }[] = [
  { href:"/", name: "Dashboard" },
  { href:"/pelanggan", name: "Pelanggan" },
  { href:"/product", name: "Product" },
  { href:"/report", name: "Report" },
  { href:"/user", name: "User", isAdmin: true },
]

const user = getUser()

console.log(user)
export function Navbar(){
  const router = useRouter()
  const logout = async () => {
    router.push('/login')
  }

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">Kasir</a>
      </div>
      <div className="flex-none">
        <ul className="hidden sm:flex menu menu-horizontal px-1">
          {linkList.map((link, i) => (
            !link.isAdmin && (
              <li key={i}><a href={link.href}>{link.name}</a></li>
            )
          ))}
          {linkList.map((link, i) => (
            link.isAdmin && user?.isAdmin && (
              <li key={i}><a href={link.href}>{link.name}</a></li>
            )
          ))}
        </ul>
        <ul className="menu menu-horizontal px-1">
          <li className="sm:hidden block">
            <details>
              <summary>
                Parent
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                {linkList.map((link, i) => (
                  <li key={i}><a href={link.href}>{link.name}</a></li>
                ))}
              </ul>
            </details>
          </li>
        </ul>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            {/* <ImageProfile username={user?.name as string} isRounded={true} userImage={user?.image as string} /> */}
            <div className="avatar placeholder">
              <div className='bg-neutral text-neutral-content w-14 text-center rounded-full'>
                <p className='text-2xl'>{getInitials(user.name)}</p>
              </div>
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
