import React from "react";
import DayListItem from "./DayListItem";

export default function(props) {

  
  const days = props.days.map(day => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name}
        spots={day.spots}
        day={props.day}
        setDay={props.setDay}
        selected={props.day === day.name ? true : false}
      />
    )
  })

  return(
    <ul>
      {days}
    </ul>
  )
}