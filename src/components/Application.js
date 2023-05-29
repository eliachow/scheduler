import React, { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState(prevState => ({...prevState, day}));

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
  }

  useEffect(() => {

  Promise.all([
    Axios.get("http://localhost:8001/api/days"),
    Axios.get("http://localhost:8001/api/appointments"),
    Axios.get("http://localhost:8001/api/interviewers")
  ])
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

  
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
    return(
        <Appointment
          key={appointment.id} 
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={dailyInterviewers}
          bookInterview={bookInterview}
          onSave={bookInterview}
        />
    )
  })


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
          bookInterview={bookInterview}
          onSave={bookInterview}
        />
      </section>
    </main>
  );
}
