import React from "react";
import DayListItem from "./DayListItem";

export default function(props) {

  // 👉👉👉👉rendering loop on each day, need to restric by specific day
  const days = props.days.map(day => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name}
        spots={day.spots}
      />
    )
  })

  return(
    <ul>
      {days}
    </ul>
  )
}