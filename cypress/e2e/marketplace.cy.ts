describe('Marketplace / Anúncios', () => {
  beforeEach(() => {
    cy.visit('/anuncios')
  })

  it('deve carregar lista de anúncios', () => {
    cy.url().should('include', '/anuncios')
    cy.get('body').should('be.visible')
  })

  it('deve responder API de anúncios', () => {
    cy.request('/api/anuncios').its('status').should('eq', 200)
  })

  it('deve abrir página de revendas', () => {
    cy.visit('/revendas')
    cy.url().should('include', '/revendas')
    cy.get('body').should('be.visible')
  })
})
