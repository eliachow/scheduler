// import dependencies
import React from 'react';
import 'components/Appointment/styles.scss'
import useVisualMode from 'hooks/useVisualMode';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';


// Appointment component renders the Appointment slots in the app
export default function Appointment(props) {

  // modes of the appointment - used by the useVisualMode hook to manage component's visual transitions.
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


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
    // render saving status
    transition(SAVING);
    // invoke functions received from props to update the Application (parent) component's state and make the PUT rquest to update the appointment on the server.
    props
      .bookInterview(props.id, interview)
      .then(() => {
        // transition the Appointment component mode to show
      transition(SHOW);
      }) 
      .catch(error => {
        console.log("Error updating appointment: ", error);
        transition(ERROR_SAVE, true);
      })
  }

  function confirm() {
    // confirm cancellation 
    transition(CONFIRM);
  }

  function edit() {
    // edit appointment
    transition(EDIT);
  }

  // cancel the appointment
  function destroy() {
    // render deleting status
    transition(DELETING, true);
    // invoke the cancel interview function in the Application component from the Appointments prop, provide the appointment id as an argument
    props
      .cancelInterview(props.id)
      // once the Axios call is complete (in Application compoment) transiton to Empty
      .then(() => {
        transition(EMPTY);
      })
      // catch in the component so it's easier to provide a msg to the user on the front end
      .catch(error => {
        console.log("Error deleting appointment: ", error);
        transition(ERROR_DELETE, true);
      })
  }

  // Render the Appointment component
  return (
    <article className='appointment' data-testid="appointment">
      <Header time={props.time} />
      {/* check the value of mode to determine how the Appointment will render & pass the appropriate props */}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === EMPTY && (
        <Empty  onAdd={() => transition(CREATE)} />
      )}
      {((mode === CREATE) || (mode === EDIT)) && (
        <Form 
          interviewers={props.interviewers}
          student={props.interview ? props.interview.student : ""}
          interviewer={props.interview && props.interview.interviewer ? props.interview.interviewer.id : null} 
          onSave={save}
          onCancel={back}
          />
      )}
      {mode === SAVING && (
        <Status 
          message="Saving..."
        />
      )}
      {mode === DELETING && (
        <Status 
          message="Deleting..."
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you would like to delete?"
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {((mode === ERROR_SAVE) || (mode === ERROR_DELETE)) && (
        <Error
          message={mode === ERROR_SAVE ? "Could not save appointment" : "Could not delete appointment"}
          onClose={back}
        />
      )}
    </article>
  )
}