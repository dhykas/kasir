import Image from "next/image";

function getInitials(name: string) {
    const words = name?.split(" ");
    const initials = words?.map(word => word.charAt(0).toUpperCase());
    return <div className="text-2xl">{initials?.join("")}</div>;
  }


export default function ImageProfile({ userImage, username, isRounded } : { userImage?: string, username: string, isRounded?: boolean  }){
    if(userImage){
        return(
            <div className="avatar">
                <div className={`w-14 ${isRounded ? 'rounded-full': 'rounded-md' }`}>
                <Image priority src={`/user/${userImage}`} alt="product" width={1000} height={144} />
                </div>
            </div>
        )
    }else{
        return(
            <div className="avatar placeholder">
              <div className={`bg-neutral text-neutral-content ${isRounded ? "rounded-full" : "rounded-md"}  w-24`}>
              {getInitials(username)}
              </div>
            </div> 
        )
    }
}