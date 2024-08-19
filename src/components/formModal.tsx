import { ReactNode } from "react";

interface FormModalProps{
    FMRef: any,
    children?: ReactNode
}
export function FormModal({ FMRef, children }: FormModalProps){
    return (
        <dialog id="my_modal_2" ref={FMRef} className="modal ">
        <div className="modal-box">
            {children}
        </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}