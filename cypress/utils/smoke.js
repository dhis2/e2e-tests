export const smokeTitle = (name, fallbackLabel) => {
  const trimmed = typeof name === "string" ? name.trim() : "";
  return trimmed || fallbackLabel;
};

export const checkHasNoErrors = (type, title, { checkNoData = false } = {}) => {
  cy.getConsoleLogs().should((logs) => {
    const reportLog =
      type +
      ": " +
      title +
      " has " +
      logs.length +
      " severe errors: \n" +
      JSON.stringify(logs, null, 1);

    if (checkNoData) {
      cy.contains("No data", {
        matchCase: false,
        timeout: 5000,
      }).should("not.exist");
    }

    expect(logs, reportLog).to.have.length(0);
  });
};

// Returns items to iterate over, or registers a single placeholder test and
// returns null when the Cypress-env list is empty. The it() call for each
// real item stays in the calling spec file (not in here) so static analysis
// (e.g. SonarCloud's "add some tests to this file" check) can still see it.
export const smokeItems = (items, emptyMessage) => {
  if (!Array.isArray(items) || items.length === 0) {
    it(emptyMessage, () => {
      cy.log(emptyMessage);
    });
    return null;
  }

  return items;
};
