import { useState } from "react";

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setMode(newMode);
      setHistory(prevHistory => [...prevHistory.slice(0, -1), newMode]);
    } else {
      setMode(newMode);
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  }

  function back() {
    if (history.length > 1) {
      const updatedHistory = [...history];

      // Remove the current mode from history
      updatedHistory.pop();
      const prevMode = updatedHistory[updatedHistory.length - 1];
      setMode(prevMode);
      setHistory(updatedHistory);
    }
  }

 return {
  mode,
  transition,
  back
 }
}


