import { PrismaClient } from '@prisma/client'
import { productSeeder } from './productSeedeer';
import { categorySeeder } from './categorySeeder';
import { userSeeder } from './userSeeder';
import { transactionSeeder } from './transactionSeeder';

const prisma = new PrismaClient()

async function main(){

  // reset database
  await prisma.productTransaction.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({})
  await prisma.pelanggan.deleteMany({})
  await prisma.user.deleteMany({});
  // seed
  const admin = await userSeeder("admin", "admin@gmail.com", "admin", true, "admin_store");
  const testUser = await userSeeder("test", "test@gmail.com", "password", false, "test_store");
  // const kat1 = await categorySeeder("kategori 1", testUser.uid)
  // const kat2 = await categorySeeder("kategori 2", testUser.uid)
  // productSeeder(testUser.uid, kat1.uid, 5);
  // productSeeder(testUser.uid, kat2.uid, 3);
  // transactionSeeder(testUser.uid, 180)
  // transactionSeeder(testUser.uid, 230,1)
  // transactionSeeder(testUser.uid, 80,2)
  // transactionSeeder(testUser.uid, 120,3)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })