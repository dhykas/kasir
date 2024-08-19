interface ConfProps{
    title?: string,
    text: string, 
    btnText: string, 
    btnfunc: any, 
    btnClass?: string, 
    confRef: any 
}

export function Conf({ title, text, btnText, btnfunc, btnClass, confRef }: ConfProps){
    return(
        <dialog ref={confRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-4">{text}</p>
            <div className="modal-action">
            <form className="flex gap-2" method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button onClick={btnfunc} className={`${btnClass} btn`}>{btnText}</button>
            </form>
            </div>
        </div>
        </dialog>
    )
}