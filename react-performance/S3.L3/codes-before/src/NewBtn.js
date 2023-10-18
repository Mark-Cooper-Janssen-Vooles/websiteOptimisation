import React from "react";

const NewBtn = ({ onClick }) => {
  return (
    <button className="new-star" onClick={onClick}>
      ⭐
    </button>
  );
}

export default React.memo(NewBtn)