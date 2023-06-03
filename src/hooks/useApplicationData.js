import { useState, useEffect } from "react";
import Axios from "axios";


export default function useApplicationData() {

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
  }


  // use the appointment id to find the appointment and set it's interview data to null.
  function cancelInterview(id) {

    // create an empty interview object
    const interview = null;

    // create a new appointment object by merging the existing appointment data with the new interview data
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // create a new appointments object by merging the existing appointments with the updated appointment using the id as the key
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    // make a PUT request to update the appointment on the server with the { interview } data - pass to the request body
    return Axios.delete(`/api/appointments/${id}`, { interview })
    // when the response comes back, update the previous state using the existing state
    .then(() => {
      setState((prevState) => ({
        ...prevState,
        appointments
      }))
    })
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


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}