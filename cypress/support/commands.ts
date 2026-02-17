declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login', { failOnStatusCode: false })
  cy.get('body').then(($body) => {
    const hasEmail = $body.find('input[type="email"]').length > 0
    const hasPassword = $body.find('input[type="password"]').length > 0
    const hasSubmit = $body.find('button[type="submit"]').length > 0

    if (hasEmail) cy.get('input[type="email"]').first().clear().type(email)
    if (hasPassword) cy.get('input[type="password"]').first().clear().type(password)
    if (hasSubmit) cy.get('button[type="submit"]').first().click({ force: true })
  })
})

export {}
