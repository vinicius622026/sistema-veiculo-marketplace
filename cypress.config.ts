import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('task', {
        log(message: string) {
          console.log(message)
          return null
        },
      })
    },
  },
  video: false,
  viewportWidth: 1366,
  viewportHeight: 768,
})
