// import dependencies
import React, { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application() {

  const [state, setState] = useState({
    // default states
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  // use the spread operator to copy all properties from prevState into a new object. Set the value of the 'day' property in the new object to the value of the 'day' parameter.
  const setDay = day => setState(prevState => ({...prevState, day}));


  function bookInterview(id, interview) {
    
    // create a new appointment object by merging the existing appointment data with the new interview data
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // create a new appointments object by merging the existing appointments with the updated appointment using the id as the key
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    
    console.log("👉👉👉", interview);
    // Make a PUT request to update the appointment on the server with the { interview }data -- pass to the request body
    // Return the whole Axios call so that the promise can be resolved.  
    return Axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      // when the response comes back update the previous state using the existing state
      setState((prevState) => ({
        ...prevState,
        appointments
      }));
    })
    .catch(error => {
      console.log("Error updating appointment: ", error);
    })
  }


  // use the appointment id to find the appointment and set it's interview data to null.
  function cancelInterview(id) {

  }

  // use useEffect to perform side effects, will run when page is loaded + if there are agruments in the dependency array []
  useEffect(() => {

  // use Promise to make asynchronous requests to fetch the API data
  Promise.all([
    Axios.get("http://localhost:8001/api/days"),
    Axios.get("http://localhost:8001/api/appointments"),
    Axios.get("http://localhost:8001/api/interviewers")
  ])
  // Once all the requests are resolved, the data is stored in the component's state using the setState function
  .then(([daysResponse, appointmentsResponse, interviewersResponse]) => {
    setState(prevState => ({
      ...prevState,
      days: daysResponse.data,
      appointments: appointmentsResponse.data,
      interviewers: interviewersResponse.data
    }));
  })
  .catch(error => {
    console.log("Error fetching data:", error);
  });
 }, []);

  // Data Selectors - helper functions are imported from Selectors module - send the state as an argument and return the interviewers and appointments for the selected day
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  // The schedule reprsents the schedule of appointments for the selected day. Iterate over the dailyAppointments and create an Appointment component for each appointment.
  const schedule = dailyAppointments.map((appointment) => {
    // Data Selector - helper function imported from Selectors module, returns interview data to be passed down the the Appointment component as a prop.
    const interview = getInterview(state, appointment.interview);
    
    return(
        <Appointment
          key={appointment.id} 
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={dailyInterviewers}
          bookInterview={bookInterview}
        />
    )
  })


  // Render component
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment 
          key="last" 
          time="5pm" 
        />
      </section>
    </main>
  );
}
