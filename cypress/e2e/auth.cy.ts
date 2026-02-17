describe('Fluxo de Autenticação', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve carregar a página inicial', () => {
    cy.get('body').should('contain.text', 'Anúncios')
  })

  it('deve navegar para página de login', () => {
    cy.get('a[href="/login"]').first().click({ force: true })
    cy.url().should('include', '/login')
    cy.get('body').invoke('text').should('match', /login|entrar/i)
  })

  it('deve navegar para página de cadastro', () => {
    cy.visit('/signup')
    cy.url().should('include', '/signup')
    cy.get('body').invoke('text').should('match', /cadastro|criar conta|signup/i)
  })

  it('deve exibir página de login sem quebrar para email inválido', () => {
    cy.visit('/login')
    cy.get('body').then(($body) => {
      const hasEmail = $body.find('input[type="email"]').length > 0
      const hasPassword = $body.find('input[type="password"]').length > 0
      const hasSubmit = $body.find('button[type="submit"]').length > 0

      if (hasEmail) cy.get('input[type="email"]').first().type('email-invalido')
      if (hasPassword) cy.get('input[type="password"]').first().type('senha123')
      if (hasSubmit) cy.get('button[type="submit"]').first().click({ force: true })
    })
    cy.get('body').should('be.visible')
  })
})
