import React from "react";

import { render, cleanup, waitForElement, fireEvent, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

// required to use the scoped queries: 
import { getByText, prettyDOM } from "@testing-library/react";


afterEach(cleanup);

describe("Application", () => {

  // it("renders without crashing", () => {
  //   render(<Application />);
  // });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {

    // the deconstructed getByText is only used within the scope of this test, will not use the imported getByText for this test
    const { getByText } = render(<Application />)
    return waitForElement(() => getByText("Monday")).then(() =>{
      fireEvent.click(getByText("Tuesday"));

      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    
    });
  })

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // Render the application and store the container value returned by render. 
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];


    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // can use either test, getBy will throw an error, queryBy will return null:
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    
    const day = getAllByTestId(container, "day").find(day =>
      // queryBy will return null if no node is found
      queryByText(day, "Monday") 
    );

    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();

  })

})


