import "./commands/wait.js";
import "./commands/logs.js";

// Cypress throws an exception in dashboard tests when scrolling/using the viewport.
// This disables that exception.
// See https://github.com/quasarframework/quasar/issues/2233
Cypress.on("uncaught:exception", (err) => {
  // List of error messages to ignore
  const ignoredErrors = [
    "ResizeObserver loop limit exceeded",
    "Unauthorized",
    "importScripts is not defined",
  ];

  // Check if the error message includes any of the ignored errors
  const shouldIgnoreError = ignoredErrors.some((ignoredError) =>
    err.message.includes(ignoredError)
  );

  if (shouldIgnoreError) {
    return false;
  }
});

Cypress.Commands.add("login", () => {
  const username = Cypress.env("LOGIN_USERNAME");
  const password = Cypress.env("LOGIN_PASSWORD");

  const loginWithNewEndpoints = () => {
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        username,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      cy.log("Logged in using new endpoint:", resp);
    });
  };

  const loginWithOldEndpoints = () => {
    cy.request({
      method: "POST",
      url: "/dhis-web-commons-security/login.action",
      form: true,
      followRedirect: true,
      retryOnStatusCodeFailure: true,
      body: {
        j_username: username,
        j_password: password,
      },
    }).then((resp) => {
      cy.log("Logged in using old endpoint:", resp);
    });
  };

  const checkLoginEndpoint = () => {
    return cy
      .request({
        method: "GET",
        url: "/api/loginConfig",
        failOnStatusCode: false,
      })
      .then((resp) => {
        if (resp.status === 200 && resp.body.apiVersion) {
          loginWithNewEndpoints();
        } else {
          loginWithOldEndpoints();
        }
      });
  };

  cy.session(
    [username, password],
    () => {
      checkLoginEndpoint();
    },
    {
      validate() {
        cy.request("/api/me").its("status").should("equal", 200);
      },
    }
  );
});
