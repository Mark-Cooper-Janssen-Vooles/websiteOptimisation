import React from "react";

export class Info extends React.Component {
  render() {
    const Stars = Object.values(this.props.Stars);

    const distances = { max: 0, min: 1000 };
    Stars.forEach((currentStar) => {
      Stars.forEach((compareStar) => {
        if (compareStar === currentStar) {
          return;
        }

        distances.max = Math.max(
          distances.max,
          Math.max(Number(currentStar.age), Number(compareStar.age))
        );
        distances.min = Math.min(
          distances.min,
          Math.min(Number(currentStar.age), Number(compareStar.age))
        );
      });
    });

    return (
      <div className="board">
        <div>You have {Object.keys(this.props.Stars).length} stars!</div>
        <div>Age of the oldest star: {distances.max}</div>
        <div>Age of the youngest star: {distances.min}</div>
      </div>
    );
  }
}
