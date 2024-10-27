import { useEffect, useRef, useState } from "react";
import Question from "./Question";
import Score from "./Score";
import Timer from "./Timer";
import "../styles/user.css";
import "../styles/game.css";
import gameStartAudio from "../assets/sounds/src_sounds_play.mp3";

function Game() {
  const [start, setStart] = useState(false);
  const [qnNum, setQnNum] = useState(-1);

  useEffect(() => {
    console.log("hellooo");
  }, []);
  if (!start) {
    return (
      <div className="user-container">
        <div className="user-details">
          <input type="text" placeholder="Enter Your Name" name="name" />

          <button
            onClick={(e) => {
              setStart(true);
              const audioEl = new Audio(gameStartAudio);
              audioEl.play();
            }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="game-container">
      <div className="game-section">
        {/* <Timer /> */}
        <Question qnNum={qnNum} setQnNum={setQnNum} />
      </div>
      <Score qnNum={qnNum} setQnNum={setQnNum} />
    </div>
  );
}

export default Game;
