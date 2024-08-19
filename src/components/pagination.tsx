interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setPages: any
}

export default function Pagination({ currentPage, totalPages, setPages }: PaginationProps) {
    const paginationArray = generatePaginationArray(currentPage, totalPages);
    function generatePaginationArray(currentPage: number, totalPages: number): Array<number | string> {
        const paginationRange = 2; // Number of pages to display around the current page
        const paginationArray: Array<number | string> = [];
    
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - paginationRange && i <= currentPage + paginationRange)) {
                paginationArray.push(i);
            } else if (paginationArray[paginationArray.length - 1] !== '...') {
                paginationArray.push('...');
            }
        }
    
        return paginationArray;
    }

    function handlePage(numPg: number){
        setPages(numPg)
    }    

    return (
        <div className="join">
            {paginationArray.map((item, index) => (
                <button onClick={() => handlePage(item as number)} disabled={item === currentPage} className="join-item btn" key={index}>
                    {item === '...' ? (
                        <span>...</span>
                    ) : (
                        <span>{item}</span>
                    )}
                </button>
            ))}
        </div>
    );
}