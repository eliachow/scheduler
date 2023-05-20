import React from "react" 
import "components/InterviewerList.scss"
import InterviewerListItem from "./InterviewerListItem";


export default function InterviewerList(props) {

  const { interviewers, value, onChange } = props


  // loop through interviewers list and return individual interviewer
  const interviewerList = interviewers.map(interviewerItem => {
    return(
      <InterviewerListItem 
        key={interviewerItem.id}
        name={interviewerItem.name}
        avatar={interviewerItem.avatar}
        selected={interviewerItem.id === value}
        setInterviewer={() => onChange(interviewerItem.id)}
      />
    )
  })


  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewers</h4>
      <ul className="interviewers__list">
          {interviewerList}
      </ul>
    </section>
  );
}