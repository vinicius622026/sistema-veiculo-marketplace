require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function main(){
  try{
    const SUPABASE_ID = process.argv[2] || '3f9061bd-49ff-477e-9da2-5165c4d3a825';
    console.log('Checking User with id=', SUPABASE_ID);
    const user = await prisma.user.findUnique({ where: { id: SUPABASE_ID } });
    console.log('User:', user);

    console.log('\nListing Revendas for owner_id=', SUPABASE_ID);
    const revendas = await prisma.revenda.findMany({ where: { owner_id: SUPABASE_ID } });
    console.log('Revendas:', revendas);

    console.log('\nListing last 5 Anuncios:');
    const anuncios = await prisma.anuncio.findMany({ orderBy: { created_at: 'desc' }, take: 5 });
    console.log('Anuncios:', anuncios);

  }catch(e){
    console.error('Error:', e);
    process.exitCode = 1;
  }finally{
    await prisma.$disconnect();
  }
})();
