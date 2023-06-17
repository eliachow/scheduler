const { getByAltText } = require("@testing-library/react");

describe("Appointments", () => {
  beforeEach(() => {
    // Reset the database
    cy.request("GET", "/api/debug/reset")

    // Visits the root of our web server
    cy.visit("/");
    cy.contains("Monday");
  })

  it("should book an interview", () => {
    // Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]")
      .first()
      .click();

    // Enters their name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // Chooses an interviewer
    cy.get("[alt='Sylvia Palmer']").click();

    // Clicks the save button
    cy.contains("Save")
      .click();

    // Sees the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  })

  it("should edit an interview", () => {
    // Visits the root of our web server - handled in beforeEach()
    // The edit button is only revealed when we hover over the appointment. When we try and click on it, it will start "waiting for actionability". We want to use the click arguments to force the action and disable "waiting for actionability"
    // Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]").first().click({ force: true });
    
    // Changes the name and interviewer: "Tori Malcolm"
    cy.get("[data-testid=student-name-input]").clear().type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();

    // Clicks the save button
    cy.contains("Save")
      .click();

    // Sees the edit to the appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })

  it("should cancel an interview", () =>{
    // Clicks the delete button for the existing appointment
    cy.get("[alt=Delete]").click({ force: true });

    // Clicks the confirm button
    cy.contains("Confirm").click();

    // check that the "Deleting" indicator should exist
    cy.contains("Deleting...").should("exist");

    // check that the "Deleting" indicator should not exist
    cy.contains("Deleting...").should("not.exist");

    // Sees that the appointment slot is empty
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");

  })
})