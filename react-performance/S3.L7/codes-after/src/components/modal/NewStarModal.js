import React, { useState } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

export default function NewStarModal({ isOpen, onAdd, onClose }) {
  const [StarText, setStarText] = useState("");
  const [isDone, setIsDone] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "20vw",
          height: "35vh",
        },
      }}
      contentLabel="Example Modal"
    >
      {isDone && (
        <div>
          <h2>
            {" "}
            <span role="img" aria-label="check">
              👏
            </span>
          </h2>
          <button
            style={{
              marginTop: 25,
              backgroundColor: "#e05900",
              color: "#fff",
              padding: 8,
              width: "100%",
              textAlign: "center",
              fontSize: 18,
            }}
            onClick={onClose}
          >
            Finish
          </button>
        </div>
      )}

      {!isDone && (
        <>
          <h2>INSERT A NEW STAR!</h2>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Star Age
          </div>
          <input
            style={{
              borderRadius: "5px",
              border: "1px dashed #333",
              width: "100%",
              margin: "0 auto",
              fontSize: 17,
              padding: 4,
              marginTop: 5,
            }}
            value={StarText}
            onChange={(ev) => setStarText(ev.currentTarget.value)}
          />

          <button
            style={{
              borderRadius: "10px",
              marginTop: 25,
              backgroundColor: "#e05900",
              color: "#fff",
              padding: 8,
              width: "100%",
              textAlign: "center",
              fontSize: 18,
            }}
            onClick={() => {
              onAdd(StarText);
              setIsDone(true);
            }}
          >
            Submit
          </button>
        </>
      )}
    </Modal>
  );
}
