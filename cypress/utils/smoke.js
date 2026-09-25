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

// Shared shape for every "iterate a Cypress-env list, visit each item, assert
// zero severe console errors" smoke suite (apps, visualizations, event
// reports/charts, line lists, maps).
export const runSmokeSuite = (
  items,
  { emptyMessage, getTitle, visit, type, checkNoData = false }
) => {
  if (!Array.isArray(items) || items.length === 0) {
    it(emptyMessage, () => {
      cy.log(emptyMessage);
    });
    return;
  }

  items.forEach((item) => {
    const title = getTitle(item);

    it(title, () => {
      visit(item);
      checkHasNoErrors(type, title, { checkNoData });
    });
  });
};
