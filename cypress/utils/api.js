export const getCurrentUserDisplayName = () => {
  return cy.request('/api/me?fields=displayName')
    .then(response => {
      return response.body.displayName
    })
}