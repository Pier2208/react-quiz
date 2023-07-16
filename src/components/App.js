import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'ready': questions loaded, 'active': quizz started, 'error', 'completed'
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null
      };
    default:
      return state;
  }
}

export default function App() {
  const [{ questions, index, answer, status }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch(" http://localhost:8000/questions");
        const questions = await res.json();
        dispatch({ type: "dataReceived", payload: questions });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    };
    loadQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            {answer !== null && <NextButton dispatch={dispatch} />}
          </>
        )}
      </Main>
    </div>
  );
}
