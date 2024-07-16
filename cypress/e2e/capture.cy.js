/// <reference types="cypress" />

import {
  openApp,
  fillEventForm,
  addNote,
  openEvent,
  Selectors,
  ContextActions,
  getNoteByValue,
} from "../utils/capture";

import { getCurrentUserDisplayName } from "../utils/api";

describe(
  "Capture",
  {
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
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
      const note = "Test note";
      cy.visit(
        "dhis-web-capture/index.html#/new?orgUnitId=DiszpKrYNg8&programId=q04UBOqq3rp"
      );
      cy.intercept("POST", "**/tracker*").as("post");

      fillEventForm();
      addNote(note);

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
        getNoteByValue(note)
          .get("[data-test=note-user]")
          .should("have.text", displayName);
      });
    });
  }
);
