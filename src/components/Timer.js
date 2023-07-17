import React, { useEffect } from "react";

export default function Timer({ dispatch, secondsRemaining }) {
  const formatTimer = (secondsRemaining) => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    return (
      <div className="timer">
        {minutes < 10 ? `0${minutes}`  : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  return formatTimer(secondsRemaining);
}
