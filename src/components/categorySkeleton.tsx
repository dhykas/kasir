import { usePathname } from "next/navigation";

export function CategorySkeleton(){
    const curPath = usePathname();
    return(
        <div>
            <div className="skeleton h-4 w-44 my-4"></div>
            <section className={`grid gap-6 ${curPath !== '/' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <div>
                    <div className="skeleton h-32 w-[280px]"></div>
                    <div className="skeleton h-4 w-[200px] mt-4"></div>
                    <div className="skeleton h-4 w-[280px] mt-2"></div>
                </div>
                <div>
                    <div className="skeleton h-32 w-[280px]"></div>
                    <div className="skeleton h-4 w-[200px] mt-4"></div>
                    <div className="skeleton h-4 w-[280px] mt-2"></div>
                </div>
                <div>
                    <div className="skeleton h-32 w-[280px]"></div>
                    <div className="skeleton h-4 w-[200px] mt-4"></div>
                    <div className="skeleton h-4 w-[280px] mt-2"></div>
                </div>
                <div>
                    <div className="skeleton h-32 w-[280px]"></div>
                    <div className="skeleton h-4 w-[200px] mt-4"></div>
                    <div className="skeleton h-4 w-[280px] mt-2"></div>
                </div>
                <div>
                    <div className="skeleton h-32 w-[280px]"></div>
                    <div className="skeleton h-4 w-[200px] mt-4"></div>
                    <div className="skeleton h-4 w-[280px] mt-2"></div>
                </div>
          </section>
          </div>
    )
}