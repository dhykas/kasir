import { PrismaClient, Product } from "@prisma/client";


const randomNumberLength = (length: number) => {
    return Math.floor(Math.random() * length); // get random number of array product
};

const randomNum = () => {
    return Math.floor(Math.random() * 5) + 1; //random 1-5
};

export async function transactionSeeder(userId: string, count: number, numBefore?: number) {
    const prisma = new PrismaClient();

    const curdate = new Date();
    if (numBefore) {
        let monthBefore = curdate.getMonth() - numBefore;
        if (monthBefore < 0) {
            monthBefore += 12;
        }
        curdate.setMonth(monthBefore);
    }

    let allTransdata = [];
    for (let i = 0; i < count; i++) {
        const newTrans = await prisma.transaction.create({
            data: {
                userId,
                total_price: 0,
                total_quantity: 0,
                createdAt: curdate,
            },
        });
        allTransdata.push(newTrans);
    }

    const product: Product[] = await prisma.product.findMany({
        where: {
            userId
        }
    });

    allTransdata.map(async (trans) => {
        // console.log(trans.uid);
    
        const uniqueProdUids = new Set(); // Set to store unique product UIDs for each transaction
    
        let totalPrice = 0;
        let totalQuantity = 0;
    
        // Loop to add products to the transaction
        for (let i = 0; i <= randomNum(); i++) {
            let prod_uid;
    
            // Loop until a unique product UID is found for this transaction
            do {
                prod_uid = product[randomNumberLength(product.length)].uid;
            } while (uniqueProdUids.has(prod_uid)); // Check if the product UID is already added
    
            uniqueProdUids.add(prod_uid); // Add the product UID to the set
    
            // console.log("prod uid: " + prod_uid);
    
            // Insert productTransaction records here
            const quantity = randomNum(); // Generate random quantity for this product
    
            await prisma.productTransaction.create({
                data: {
                    productId: prod_uid,
                    transactionId: trans.uid,
                    quantity: quantity,
                    createdAt: curdate
                },
            });
    
            // Now, update total price and total quantity
            const prod = product.find(p => p.uid === prod_uid);
            if (prod) {
                const prodTotalPrice = prod.price * quantity; // Calculate total price for this product
                totalPrice += prodTotalPrice; // Add product total price to overall transaction total price
                totalQuantity += quantity; // Add quantity to the overall transaction total quantity
            }
        }
    
        // Update the transaction with the calculated total price and total quantity
        await prisma.transaction.update({
            where: { uid: trans.uid },
            data: {
                total_price: totalPrice,
                total_quantity: totalQuantity,
            },
        });
    });
    
    
     
    
}    