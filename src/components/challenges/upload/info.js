import React from "react";
import FadeIn from "react-fade-in";
function Info() {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "45%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          color: "#616161",
          fontSize: "24px",
        }}
      >
        <FadeIn>
          <p1>Drag and Drop an Image</p1>
          <br />
          <p1>or</p1>
          <br />
          <p1>Click to open file explorer</p1>
        </FadeIn>
      </div>
    </div>
  );
}

export default Info;
