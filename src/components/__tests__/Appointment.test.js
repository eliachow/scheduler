import React from "react";

// import helper functions from the react-testing-library
// render allows us to render Components
import { render } from "@testing-library/react";

// import the componenet we are testing
import Appointment from "components/Appointment";


// use the desribe functionto wrap a series of  tests
describe("Appointment", () => {

  it("renders without crashing", () => {
    render(<Appointment />);
  });


});

