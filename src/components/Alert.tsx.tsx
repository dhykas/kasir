export function Alert({ alertText, alertRef } : { alertText: string, alertRef: any }){
    return(
        <>
        <dialog ref={alertRef} className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg text-yellow-300">Warning!</h3>
            <p className="py-4">{alertText}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
        </>
    )
}