import { useEffect, useRef, useState } from "react";
import "../styles/qn.css";
import "../styles/timer.css";

function Question({ qnNum, setQnNum }) {
  const [qns, setQns] = useState([]);
  const [qnAnsDetails, setQnAnsDetails] = useState({});
  const [time, setTime] = useState(10);
  const timerId = useRef();
  const qnAnsRef = useRef();

  const [gameOver, setGameOver] = useState(false);
  const askQn = async () => {
    try {
      const resp = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      if (!resp.ok) throw new Error();
      const qnData = await resp.json();
      console.log(qnData.results);
      qnAnsRef.current = qnData.results;
      // setQns(qnData.results);
      setUpTimer();
      getQnAns();
    } catch (e) {
      alert("Api error- Refresh page");
      console.log("error-loading qns");
      //show modal with refresh button
    }
  };
  useEffect(() => {
    askQn();
    return () => {
      // console.log("hellllll");
      clearInterval(timerId.current);
    };
  }, []);
  useEffect(() => {
    // console.log(time, qnNum, "qntime");
    if (time === 0) {
      if (qnNum + 1 === qnAnsRef.current.length) {
        stopGame();
        return;
      }
      getQnAns();
    }
  }, [time]);
  const setUpTimer = () => {
    // console.log("bruv");
    clearInterval(timerId.current);
    timerId.current = setInterval(() => {
      setTime((time) => {
        if (time === 0) return 10;
        return time - 1;
      });
    }, 1000);
  };
  const getQnAns = () => {
    const qnsList = qnAnsRef.current;
    setQnNum(qnNum + 1);
    const qnAns = qnsList.find((item, index) => {
      return index === qnNum + 1;
    });
    // console.log(qns, " qnAn**");

    const { question, correct_answer, incorrect_answers } = qnAns;

    const correctAnsPos = Math.floor(Math.random() * 4);
    // answers[correctAnsPos] = correct_answer;
    const answers = [
      ...incorrect_answers.slice(0, correctAnsPos),
      correct_answer,
      ...incorrect_answers.slice(correctAnsPos),
    ];
    // const answers = [...incorrect_answers, correct_answer];

    setQnAnsDetails({
      correctAnsPos,
      question,
      answers,
    });
  };
  const getQnAnsDisp = () => {
    if (!Object.keys(qnAnsDetails).length) return null;
    const { correctAnsPos, question, answers } = qnAnsDetails;
    return (
      <div className="qn-ans-container">
        <div className="qn">{question}</div>
        {answers.map((item, index) => {
          return (
            <div
              key={item}
              className="ans"
              onClick={(e) => {
                console.log(qnNum, "event");
                if (index === correctAnsPos) {
                  setTime(10);
                  // console.log(qnNum, "qnNum event");
                  // setQnNum(qnNum + 1);
                  // askQn(); Check this
                  getQnAns();

                  alert("Correct");
                } else {
                  alert("wrong");
                  stopGame();
                }
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    );
  };

  const dispQnAns = getQnAnsDisp();
  console.log(qnNum, "qnNum*");

  function stopGame() {
    clearInterval(timerId.current);
    setGameOver(true);
    setQnNum(-1);
    setTime(10);
  }

  function restartGame() {
    clearInterval(timerId.current);
    setGameOver(false);
    setQnAnsDetails([]);
    setQnNum(-1);
    askQn();
  }

  return (
    <div className="game-section">
      <div className="timer-sec">
        <div className="timer">{time}</div>
      </div>
      {gameOver && (
        <div className="game-over">
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      {!gameOver && <div className="qn-sec">{dispQnAns}</div>}
      <div
        onClick={(e) => {
          console.log(qnNum, "qnNum here");
        }}
      >
        helooo
      </div>
    </div>
  );
}

export default Question;
