import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import CompleteScreen from "./CompleteScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'ready': questions loaded, 'active': quizz started, 'error', 'completed'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION
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
        answer: null,
      };
    case "completed":
      return {
        ...state,
        status: "completed",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "newQuiz":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'completed' : state.status
      }
    default:
      return state;
  }
}

export default function App() {
  const [{ questions, index, answer, status, points, highscore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {answer !== null && (
                <NextButton
                  dispatch={dispatch}
                  index={index}
                  numQuestions={numQuestions}
                />
              )}
            </Footer>
          </>
        )}
        {status === "completed" && (
          <CompleteScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
