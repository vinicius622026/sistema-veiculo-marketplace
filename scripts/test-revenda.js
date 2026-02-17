require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

p.revenda.create({
  data: {
    owner_id: '3f9061bd-49ff-477e-9da2-5165c4d3a825',
    nome: 'TS',
    cnpj: '',
    endereco: '',
    cidade: 'Cidade',
    estado: 'ST',
    telefone: '0000'
  }
})
  .then((r) => {
    console.log('created', r)
    return p['$disconnect']()
  })
  .catch((e) => {
    console.error('ERR', e.message)
    console.error(e)
    return p['$disconnect']().then(() => process.exit(1))
  })
