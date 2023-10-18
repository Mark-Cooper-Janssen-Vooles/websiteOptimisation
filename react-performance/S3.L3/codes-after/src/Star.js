import React from "react";

export class StarComponent extends React.Component {
  render() {
    const { Star, onDragStart, onDragEnd, onDoubleClick } = this.props;

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
  }
}
