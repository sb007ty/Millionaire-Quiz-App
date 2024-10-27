import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles/qn.css";
import "../styles/timer.css";
import moneyPyramid from "../assets/data/moneyPyramid";
import correctSound from "../assets/sounds/src_sounds_correct.mp3";
import wrongSound from "../assets/sounds/src_sounds_wrong.mp3";

function getRandomNum(start = 0, end = 4) {
  return Math.floor(Math.random() * end);
}

function Question({ qnNum, setQnNum, help, setHelp }) {
  const [time, setTime] = useState(30);
  const [randomNum, setRandomNum] = useState(-1);
  const [qnAnsResp, setQnAnsRes] = useState([]);

  const timerId = useRef();

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const askQn = async () => {
      try {
        const resp = await fetch(
          "https://opentdb.com/api.php?amount=15&category=21&difficulty=easy&type=multiple"
        );
        console.log(resp.ok, "resss");
        if (!resp.ok) throw new Error();
        const qnData = await resp.json();
        console.log(qnData.results);
        setQnAnsRes(qnData.results);
        setUpTimer();
        const rand = getRandomNum();
        setQnNum(0);
        setRandomNum(rand);
      } catch (e) {
        alert("Api error- Refresh page");
        console.log("error-loading qns");
        //show modal with refresh button
      }
    };
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
        if (time === 0) return 30;
        return time - 1;
      });
    }, 1000);
  };
  const getQnAns = useCallback(() => {
    const qnsList = qnAnsResp;

    const qnAns = qnsList.find((item, index) => {
      return index === qnNum;
    });
    // console.log(qns, " qnAn**");

    const { question, correct_answer, incorrect_answers } = qnAns;

    const correctAnsPos = randomNum;
    // answers[correctAnsPos] = correct_answer;
    const answers = [
      ...incorrect_answers.slice(0, correctAnsPos),
      correct_answer,
      ...incorrect_answers.slice(correctAnsPos),
    ];
    // const answers = [...incorrect_answers, correct_answer];

    return {
      correctAnsPos,
      question,
      answers,
    };
  }, [qnAnsResp, qnNum, randomNum]);

  const dispQnAns = useMemo(() => {
    if (!qnAnsResp?.length || randomNum === -1) return null;
    const qnAnsDetails = getQnAns();

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
                    setTime(30);
                    setQnNum(qnNum + 1);
                    setRandomNum(getRandomNum());
                    if (qnNum + 1 === qnAnsResp.length) {
                      stopGame();
                      return;
                    }
                    const correctAudio = new Audio(correctSound);
                    correctAudio.play();
                  } else {
                    // alert("wrong");
                    const correctAudio = new Audio(wrongSound);
                    correctAudio.play();
                    stopGame();
                  }
                }}
              >
                {item}
              </div>
            );
          } else {
            return (
              <div
                key={item}
                className="ans"
                style={{ visibility: "hidden" }}
              ></div>
            );
          }
        })}
      </div>
    );
  }, [randomNum, qnAnsResp, qnNum, help, getQnAns, setHelp, setQnNum]);
  console.log(qnNum, "qnNum*", randomNum);

  function stopGame() {
    clearInterval(timerId.current);
    setGameOver(true);
    setQnAnsRes([]);
    setTime(30);
  }

  function restartGame() {
    clearInterval(timerId.current);
    setGameOver(false);
    setQnAnsRes([]);
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
