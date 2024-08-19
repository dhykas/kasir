export function Modal({ modalRef, keranjang, setKeranjang }: { modalRef: any, keranjang: Keranjang[], setKeranjang: any }){
    // console.log(keranjang)

    let dataToPrint: string = '';

    async function printData(){
        keranjang.map((prod, i) => {
            dataToPrint+= i+1 + '. ' + prod.name + ' x Rp '+ prod.price + " = " + (prod.price as number * (prod.count as number)).toLocaleString('en') + '\n'
        })

        console.log(dataToPrint)

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
            });

            const server = await device?.gatt?.connect() ?? null;
            if (server) {
                const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb') ?? null;
                if (service) {
                    const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb') ?? null;
                    if (characteristic) {
                        await characteristic.writeValue(new TextEncoder().encode(dataToPrint));
                    } else {
                        console.error('Failed to get characteristic.');
                    }
                } else {
                    console.error('Failed to get service.');
                }
                clear()
                server.disconnect();
            } else {
                console.error('Failed to connect to the Bluetooth device.');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function clear(){
        setKeranjang([])
    }

    return(
        <dialog ref={modalRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Print Transaction</h3>
                <p className="py-4">Do You Want To Print Receipt too?</p>
                <div className="flex justify-end gap-2">
                <form method="dialog">
                    <button onClick={clear} className="btn btn-error text-white">Nope</button>
                </form>
                    <button onClick={printData} className="btn btn-success text-white">Print</button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}