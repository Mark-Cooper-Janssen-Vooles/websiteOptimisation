import React from "react";

const StarComponent = function StarComponent(props) {
  const { Star, onDragStart, onDragEnd, onDoubleClick } = props;
  return (
    <div
      className="Star"
      onMouseDown={(ev) => {
        const clickOffset = {
          x: ev.clientX - parseFloat(ev.currentTarget.style.left),
          y: ev.clientY - parseFloat(ev.currentTarget.style.top),
        };
        onDragStart(clickOffset);
      }}
      onMouseUp={onDragEnd}
      onDoubleClick={onDoubleClick}
      style={{
        left: Star.position.left,
        top: Star.position.top,
      }}
      key={Star.id}
    >
      ⭐{Star.age}
    </div>
  );
};
const comparison = (prevProps, nextProps) => {
  return (
    prevProps.Star.id === nextProps.Star.id &&
    prevProps.Star.position.left === nextProps.Star.position.left &&
    prevProps.Star.position.top === nextProps.Star.position.top
  );
};

export default React.memo(StarComponent, comparison);
