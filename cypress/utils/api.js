import moment from 'moment';
export const getCurrentUserDisplayName = () => {
  return cy.request('/api/me?fields=displayName')
    .then(response => {
      return response.body.displayName
    })
}

export const getCurrentUser = () => {
  return cy.request('/api/me?fields=*')
    .then(response => {
      return response.body;
    })
}

export const createEventInEventProgram = ( orgUnitId, programId ) => {
  return cy.request('POST', '/api/events', {
    orgUnit: orgUnitId,
    program: programId,
    eventDate: moment().add(1, 'days').format('YYYY-MM-DD')
  }).then(response => {
    return response.body.response.importSummaries[0].reference
  })

}