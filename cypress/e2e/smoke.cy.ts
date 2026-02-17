describe('Smoke', () => {
  it('abre a home', () => {
    cy.visit('/')
    cy.contains('Anúncios')
  })

  it('abre o dashboard', () => {
    cy.visit('/dashboard')
    cy.contains('Dashboard')
  })
})
