describe('Criar anúncio com imagens básicas (simulado)', () => {
  it('simula criação de anúncio usando URLs de imagem', () => {
    const fakeAnuncio = {
      id: 'anuncio-e2e-1',
      titulo: 'Carro teste E2E',
      preco: 15000,
      foto_url: 'https://via.placeholder.com/600x400.png',
      thumbnail_url: 'https://via.placeholder.com/200x150.png',
    }

    // intercepta a chamada ao backend e responde com o anúncio simulado
    cy.intercept('POST', '/api/anuncios').as('postAnuncio')

    // visita a página inicial (pode ser trocada para a rota do formulário)
    cy.visit('/')

    // carrega fixture PNG em base64, converte para Blob e envia via FormData
    cy.fixture('sample.png', 'base64').then((fileBase64) => {
      const blob = Cypress.Blob.base64StringToBlob(fileBase64, 'image/png')
      const form = new FormData()
      form.append('file', blob, 'sample.png')
      form.append('titulo', 'Carro teste E2E')
      form.append('descricao', 'Descrição com PNG')
      form.append('preco', String(15000))
      form.append('revenda_id', 'rev-e2e-1')
      form.append('cidade', 'Cidade')
      form.append('estado', 'SP')

      cy.window().then((win) => {
        return win.fetch('/api/anuncios', {
          method: 'POST',
          headers: { Authorization: 'Bearer token-simulado' },
          body: form,
        })
      }).then((resp: any) => resp.json())
        .then((body: any) => {
          // valida que recebemos um objeto (o interceptor do servidor de teste pode responder)
          expect(body).to.be.an('object')
        })

      // garante que a rota foi chamada
      cy.wait('@postAnuncio')
    })
  })
})
