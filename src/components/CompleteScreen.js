import React from "react";

export default function CompleteScreen({ dispatch, points, maxPossiblePoints, highscore }) {
  const percentage = (points / maxPossiblePoints) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPossiblePoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        onClick={() => dispatch({ type: "newQuiz" })}
        className="btn btn-ui"
      >
        Restart quiz!
      </button>
    </>
  );
}
