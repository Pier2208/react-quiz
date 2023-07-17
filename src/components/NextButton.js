import React from "react";

export default function NextButton({ dispatch, index, numQuestions }) {
  if (index < numQuestions - 1)
    return (
      <button
        onClick={() => dispatch({ type: "nextQuestion" })}
        className="btn btn-ui"
      >
        Next
      </button>
    );

    if (index === numQuestions - 1)
    return (
      <button
        onClick={() => dispatch({ type: "completed" })}
        className="btn btn-ui"
      >
        Finish
      </button>
    );
}
