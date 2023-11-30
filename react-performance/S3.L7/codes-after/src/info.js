import React, { useState, useMemo } from "react";

export const Info = React.memo(
  function Info(props) {
    const [exapnded, setExpanded] = useState(false);
    const Stars = Object.values(props.Stars);

    const distances = useMemo(() => {
      const distancesCalc = { max: 0, min: 1000 };
      Stars.forEach((currentStar) => {
        setTimeout(() => console.log('take awhile'), 2000)
        Stars.forEach((compareStar) => {
          if (compareStar === currentStar) {
            return;
          }
  
          distancesCalc.max = Math.max(
            distancesCalc.max,
            Math.max(Number(currentStar.age), Number(compareStar.age))
          );
          distancesCalc.min = Math.min(
            distancesCalc.min,
            Math.min(Number(currentStar.age), Number(compareStar.age))
          );
        });
      });
      return distancesCalc
    }, [Object.keys(Stars).length])


    const expandHandler = () => setExpanded(!exapnded);

    return (
      <div className={exapnded ? "bar" : "board"}>
        <div>You have {Object.keys(props.Stars).length} stars!</div>
        <div>Age of the oldest star: {distances.max}</div>
        <div>Age of the youngest star: {distances.min}</div>
        <span className="expand" onClick={expandHandler}>
          ◤ ◥
        </span>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      Object.keys(prevProps.Stars).length ===
      Object.keys(nextProps.Stars).length
    );
  }
);
