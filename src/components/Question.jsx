import { useEffect, useRef, useState } from "react";
import "../styles/qn.css";
import "../styles/timer.css";
import moneyPyramid from "../assets/data/moneyPyramid";

function Question({ qnNum, setQnNum, help, setHelp }) {
  const [qns, setQns] = useState([]);
  const [qnAnsDetails, setQnAnsDetails] = useState({});
  const [time, setTime] = useState(10);
  const timerId = useRef();
  const qnAnsRef = useRef();

  const [gameOver, setGameOver] = useState(false);
  const askQn = async () => {
    try {
      const resp = await fetch(
        "https://opentdb.com/api.php?amount=15&category=21&difficulty=easy&type=multiple"
      );
      console.log(resp.ok, "resss");
      if (!resp.ok) throw new Error();
      const qnData = await resp.json();
      console.log(qnData.results);
      qnAnsRef.current = qnData.results;
      // setQns(qnData.results);
      setUpTimer();
      console.log("object");
      getQnAns(0);
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
    if (time === 0) {
      stopGame();
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
  const getQnAns = (qnNumber) => {
    const qnsList = qnAnsRef.current;
    setQnNum(qnNumber);
    const qnAns = qnsList.find((item, index) => {
      return index === qnNumber;
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
    let fl = 0;
    return (
      <div className="qn-ans-container">
        <div className="qn">{question}</div>
        {answers.map((item, index) => {
          if (!help) fl = 0;
          if (fl === 0 || index === correctAnsPos) {
            if (index !== correctAnsPos) fl = 1;
            return (
              <div
                key={item}
                className="ans"
                onClick={(e) => {
                  console.log(qnNum, "event");
                  setHelp(false);
                  if (index === correctAnsPos) {
                    setTime(10);
                    if (qnNum + 1 === qnAnsRef.length) {
                      setQnNum(qnNum + 1);
                      stopGame();
                      return;
                    }
                    getQnAns(qnNum + 1);

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
          } else {
            return <div key={item} className="ans"></div>;
          }
        })}
      </div>
    );
  };

  const dispQnAns = getQnAnsDisp();
  console.log(qnNum, "qnNum*");

  function stopGame() {
    clearInterval(timerId.current);
    setGameOver(true);
    setTime(10);
  }

  function restartGame() {
    clearInterval(timerId.current);
    setGameOver(false);
    setQnAnsDetails([]);
    askQn();
  }
  const obj = moneyPyramid[moneyPyramid.length - qnNum];

  return (
    <div className="game-section">
      <div className="timer-sec">
        <div className="timer">{time}</div>
      </div>
      {gameOver && (
        <div className="game-over">
          <div className="amt-won">
            You won {qnNum === 0 ? "$ 0" : obj["amount"]}
          </div>
          <button onClick={restartGame} className="restart-btn">
            Restart
          </button>
        </div>
      )}
      {!gameOver && <div className="qn-sec">{dispQnAns}</div>}
    </div>
  );
}

export default Question;
