import { useState } from "react";

// custom hook that manages the visual mode state
export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // replace is an optional parameter, indicating whether to replace the current mode in the history. Replace will default to false unless explicitly sent the true agrument.
  function transition(newMode, replace = false) {
    // if replace is true, update mode with new mode and replaec the last mode in history with new mode
    if (replace) {
      setMode(newMode);
      setHistory(prevHistory => [...prevHistory.slice(0, -1), newMode]);
    // if replace is false, update mode with newMode and append newMode to the history array
    } else {
      setMode(newMode);
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  }


  function back() {
    // check if the length is greater than 1 indicating there are previous modes to go back to. 
    if (history.length > 1) {
      // use the spread operator to create a copy of the history array
      const updatedHistory = [...history];

      // Remove the current mode from history
      updatedHistory.pop();
      // Retrieve the previous mode by accessing the last element
      const prevMode = updatedHistory[updatedHistory.length - 1];
      setMode(prevMode);
      setHistory(updatedHistory);
    }
  }

 return {
    mode,
    transition,
    back
  };
}


