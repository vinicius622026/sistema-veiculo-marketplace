describe('Smoke', () => {
  it('abre a home', () => {
    cy.visit('/')
    cy.contains('Anúncios')
  })

  it('abre o dashboard', () => {
    cy.visit('/dashboard')
    cy.get('body').then(($body) => {
      const txt = $body.text()
      expect(txt.includes('Dashboard') || txt.includes('login') || txt.includes('Entrar')).to.eq(true)
    })
  })
})
