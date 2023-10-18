import React from "react";

//use React.memo() to only render if the ref. of props change
export const NewBtn = React.memo(function NewBtn({ onClick }) {
  return (
    <button className="new-star" onClick={onClick}>
      ⭐
    </button>
  );
});
