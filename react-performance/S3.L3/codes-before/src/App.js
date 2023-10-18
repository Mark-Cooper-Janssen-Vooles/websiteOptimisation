import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import useComponentSize from "@rehooks/component-size";
import StarData from "./data.json";
import { v4 as uuidv4 } from 'uuid';
import { StarComponent } from "./Star";
import { NewBtn } from "./NewBtn";
import { Info } from "./info";
import { NewStarModal } from "./components/modal/NewStarModal";

function positionStars(Stars, width, height) {
  Object.values(Stars).forEach(
    (Star) =>
      (Star.position = {
        left: Star.offset.x + width * 0.5,
        top: Star.offset.y + height * 0.5,
      })
  );
}

function parseData() {
  const Stars = {};

  StarData.forEach((task) => {
    Stars[task.id] = task;
  });

  return Stars;
}

function addStar(Stars, age) {
  const id = uuidv4();

  Stars[id] = {
    id,
    age,
    offset: {
      x: 0,
      y: 0,
    },
  };
}

function App() {
  const [Stars, setStars] = useState({});
  const [dragStarInfo, setDragStarInfo] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const boardRef = useRef(null);
  const boardSize = useComponentSize(boardRef);
  const { height, width } = boardSize;

  useEffect(() => {
    if (height && width) {
      const parsedStars = parseData();
      positionStars(parsedStars, width, height);
      setStars({ ...parsedStars });
    }
  }, [height, width]);

  function handleDelete(Star) {
    delete Stars[Star.id];
    setStars({ ...Stars });
  }

  const StarEls = Object.values(Stars).map((Star) => (
    <StarComponent
      Star={Star}
      boardSize={boardSize}
      key={Star.id}
      onDragStart={(dragOffset) => setDragStarInfo({ Star, dragOffset })}
      onDragEnd={() => setDragStarInfo(null)}
      onDoubleClick={() => handleDelete(Star)}
    />
  ));

  return (
    <div
      className="App"
      ref={boardRef}
      onMouseMove={(ev) => {
        if (!dragStarInfo) {
          return;
        }

        const { Star, dragOffset } = dragStarInfo;

        Star.position = {
          top: ev.pageY - dragOffset.y,
          left: ev.pageX - dragOffset.x,
        };

        setStars({ ...Stars });
      }}
    >
      {StarEls}
      <Info Stars={Stars} />
      <NewBtn onClick={() => setIsAddOpen(true)} />
      {isAddOpen && (
        <NewStarModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={(StarText) => {
            addStar(Stars, StarText);
            positionStars(Stars, width, height);
            setStars(Stars);
          }}
        />
      )}
    </div>
  );
}

export default App;
