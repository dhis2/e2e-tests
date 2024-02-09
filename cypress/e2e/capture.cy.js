/// <reference types="cypress" />

import {
  openApp,
  fillEventForm,
  addComment,
  openEvent,
  Selectors,
  ContextActions,
  getCommentByValue,
} from "../utils/capture";

import { getCurrentUserUsername } from "../utils/api";

describe("Capture", () => {
  beforeEach(() => {
    openApp();
  });

  it("should open new event form", () => {
    ContextActions.selectProgramByName("Information Campaign");
    ContextActions.selectOrgUnitByName("Ngelehun CHC");
    cy.get(Selectors.NEW_EVENT_BUTTON)
      .click()
      .get(Selectors.NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON)
      .click();

    cy.get(Selectors.NEW_EVENT_FORM).should("be.visible");
  });

  it("should create event", () => {
    const comment = "Test comment";
    cy.visit(
      "dhis-web-capture/index.html#/new?orgUnitId=DiszpKrYNg8&programId=q04UBOqq3rp"
    );

    let interceptRoute = "";
    if (Cypress.config("baseUrl").includes("v37")) {
      interceptRoute = "**/events*";
    } else {
      interceptRoute = "**/tracker*";
    }

    cy.intercept("POST", interceptRoute).as("post");
    fillEventForm();
    addComment(comment);

    cy.get(Selectors.SAVE_BUTTON).click();

    cy.wait("@post").then((interception) => {
      let eventId;
      if (Cypress.config("baseUrl").includes("v37")) {
        eventId =
          interception.response.body.response.importSummaries[0].reference;
      } else {
        eventId =
          interception.response.body.bundleReport.typeReportMap["EVENT"]
            .objectReports[0].uid;
      }
      cy.wrap(eventId).as("eventId");
    });

    cy.location("href").should("not.contain", "new");
    cy.get(Selectors.WORKING_LIST_TABLE).should("be.visible");
    cy.get("@eventId").then((eventId) => {
      openEvent(eventId);
    });

    getCurrentUserUsername().then((userName) => {
      getCommentByValue(comment)
        .get("[data-test=comment-user]")
        .should("have.text", userName);
    });
  });
});
