import React from "react";

export default function NextButton({ dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: "nextQuestion" })}
      className="btn btn-ui"
    >
      Next
    </button>
  );
}
