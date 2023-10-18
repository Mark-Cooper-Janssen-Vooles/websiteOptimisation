import React from "react";

const Info = (props) => {
// shouldComponentUpdate(nextProps){
//   const oldKeys = Object.keys(this.props.Stars);
//   const newKeys = Object.keys(nextProps.Stars)

//   // return true if newKeys length isn't the same as oldKeys length - only rerender in this case
//   return oldKeys.length !== newKeys.length
// }
console.log('stars from props:', props)

  const Stars = Object.values(props.Stars);

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
      <div>You have {Object.keys(props.Stars).length} stars!</div>
      <div>Age of the oldest star: {distances.max}</div>
      <div>Age of the youngest star: {distances.min}</div>
    </div>
  );
}

const comparison = (p1, p2) => Object.keys(p1.Stars).length === Object.keys(p2.Stars).length

export default React.memo(Info, comparison)