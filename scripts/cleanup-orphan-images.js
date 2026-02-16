const { runCleanup } = require('../src/lib/cleanup')

;(async () => {
  console.log('Iniciando verificação de imagens órfãs...')
  const removed = await runCleanup(['anuncios'])
  if (removed.length) {
    console.log('Removidos:', removed.length)
    removed.forEach(r => console.log(r))
  } else {
    console.log('Nenhum órfão encontrado')
  }
  console.log('Finalizado')
})().catch((e) => { console.error(e); process.exit(1) })
