describe('Gerenciar Estoque', () => {
  it('deve abrir dashboard/estoque sem erro 5xx', () => {
    cy.request({
      url: '/dashboard/estoque',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 307, 308])
    })
  })

  it('deve renderizar página de estoque ou tela de autenticação', () => {
    cy.visit('/dashboard/estoque', { failOnStatusCode: false })
    cy.get('body').invoke('text').should('match', /estoque|dashboard|login|entrar/i)
  })
})
