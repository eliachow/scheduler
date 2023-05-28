
export function getAppointmentsForDay(state, day) {

  let daysAppointments = [];

  // find the obj in state.days where name matches day
  const filteredDays = state.days.filter(el => el.name === day);

  // iterate through the days arr to access the specific day's appointments arr
  for (const element of filteredDays) {
    const appointmentsList = element.appointments;

    // iterate through appointments arr to match the apt id's to the state.appointments's id
    for (const id of appointmentsList) {
      daysAppointments.push(state.appointments[id])
    }
  }

  return daysAppointments;
}


export function getInterview(state, interview) {

  if (!interview) {
    return null;
  }

  const interviewID = interview.interviewer;
  const interviewer = state.interviewers[interviewID]
  
  return {
    student: interview.student,
    interviewer: interviewer
  }
}


export function getInterviewersForDay(state, day) {

  let daysInterviewers = [];

  // find the obj in state.days where name matches day
  const filteredDays = state.days.filter(el => el.name === day);
  
  // iterate through the days arr to access the specific day's appointments arr
  for (const element of filteredDays) {
    const interviewersList = element.interviewers;

    // iterate through appointments arr to match the apt id's to the state.appointments's id
    for (const id of interviewersList) {
      daysInterviewers.push(state.interviewers[id])
    }
  }
  
  return daysInterviewers;
}
