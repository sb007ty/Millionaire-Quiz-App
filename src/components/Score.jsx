import moneyPyramid from "../assets/data/moneyPyramid";
import "../styles/score.css";

function Score({ qnNum, setQnNum, setHelp }) {
  return (
    <div className="score-section">
      <div className="help-section">
        <span>Help - </span>
        <button onClick={(e) => setHelp(true)}>50/50</button>
      </div>
      <div className="money-section">
        {moneyPyramid.map((item) => {
          return (
            <div
              className={`money ${
                qnNum + 1 === item.id ? "selected-level" : ""
              }`}
              key={item.id}
            >
              <div className="money-level">{item.id}</div>
              <div className="money-amount">{item.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Score;
