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

import { getCurrentUserDisplayName } from "../utils/api";

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
    cy.intercept("POST", "**/tracker*").as("post");

    fillEventForm();
    addComment(comment);

    cy.get(Selectors.SAVE_BUTTON).click();

    cy.wait("@post").then((interception) => {
      cy.log(interception.response.body.bundleReport.typeReportMap["EVENT"]);
      cy.wrap(
        interception.response.body.bundleReport.typeReportMap["EVENT"]
          .objectReports[0].uid
      ).as("eventId");
    });

    cy.location("href").should("not.contain", "new");
    cy.get(Selectors.WORKING_LIST_TABLE).should("be.visible");
    cy.get("@eventId").then((eventId) => {
      openEvent(eventId);
    });

    getCurrentUserDisplayName().then((displayName) => {
      getCommentByValue(comment)
        .get("[data-test=comment-user]")
        .should("have.text", displayName);
    });
  });
});
