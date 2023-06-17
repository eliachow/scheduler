import React from "react";
import axios from "axios";
import Application from "components/Application";
import { render, cleanup, waitForElement, fireEvent, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";
// required to use the scoped queries: 
import { getByText, prettyDOM } from "@testing-library/react";


afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {

    // the deconstructed getByText is only used within the scope of this test, will not use the imported getByText for this test
    const { getByText } = render(<Application />)
    return waitForElement(() => getByText("Monday")).then(() =>{
      fireEvent.click(getByText("Tuesday"));

      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    
    });
  })

  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the application and store the container value returned by render. 
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 3. Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    // can use either test, getBy will throw an error, queryBy will return null:
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      // queryBy will return null if no node is found
      queryByText(day, "Monday") 
    );
    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  })


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday") 
    );
    expect(queryByText(day, "2 spots remaining")).toBeInTheDocument();
  })


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the applicaiton
    const { container } = render(<Application />);
    
    // 2. Finding an existing interview.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 3. With the existing interview find the edit button.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Change the name and save the interview.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
      expect(getByText(appointment, "Sylvia Palmer"));

    // 5. Check that the DayListItem with the text "Monday" has not changed and has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday") 
    );
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  })


  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });


  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 3. Click the "Add" button on the first appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    })

    // 5. Click the first interviewer in the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on the same appointment
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Chek that the element with the text "Could not save appointment" is displayed
    await waitForElement(() => 
      getByText(appointment, "Could not save appointment")
    )
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();

    // 8. When close is clicked render the form
    fireEvent.click(getByAltText(appointment, "Close"));
    await waitForElement(() => getByPlaceholderText(appointment, /enter student name/i));
    expect(getByPlaceholderText(appointment, /enter student name/i))

  })


  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))

    // 3. Click the "Delete" button on the first appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Chek that the element with the text "Could not delete appointment" is displayed
    await waitForElement(() => 
      getByText(appointment, "Could not delete appointment")
    )
    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();

    // 8. When close is clicked render the SHOW appointment
    fireEvent.click(getByAltText(appointment, "Close"));
    await waitForElement(() => getByText(container, "Archie Cohen"))
    expect(getByText(appointment, "Archie Cohen"))
  })

})


