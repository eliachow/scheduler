// import dependencies
import React from 'react';
import 'components/Appointment/styles.scss'
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import useVisualMode from 'hooks/useVisualMode';


// Appointment component renders the Appointment slots in the app
export default function Appointment(props) {

  // modes of the appointment - used by the useVisualMode hook to manage component's visual transitions.
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  // useVisualMode hook initializes the state of the Appointment component
  // mode = current mode
  // transition = function to change the mode
  // back = function to go back to the previous mode
  // Check if interview exists to determine the initial mode
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);


  // save the appointment details
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // invoke functions received from props to update the Application (parent) component's state and make the PUT rquest to update the appointment on the server.
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => {
      // transition the Appointment component mode to show
    transition(SHOW);
    }) 
  }


  // Render the Appointment component
  return (
    <article className='appointment'>
      <Header time={props.time} />
      {/* check the value of mode to determine how the Appointment will render & pass the appropriate props */}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === EMPTY && (
        <Empty  onAdd={() => transition(CREATE)} />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={back} 
          onSave={save}
          />
      )}
      {mode === SAVING && (
        <Status 
          message="Saving..."
        />
      )}
    </article>
  )
}