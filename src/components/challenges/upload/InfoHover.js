import React from "react";
import FadeIn from "react-fade-in";
const marginBottom = "30px"

function InfoHover() {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "40%",
          transform: "translate(0%,-50%)",
          color: "#616161",
          fontSize: "23px",
          margin:"30px"
        }}
      >
        <FadeIn>
          <div style={{marginBottom:marginBottom}}>
            <p1>
              Dimension MINIMUM: 1500px and a MAXIMUM: 4500px.
            </p1>
          </div >
          <div style={{marginBottom:marginBottom}}>
            <p1>
              Please Submit a Square Image, The image will auto resized to a Square if not
            </p1>
          </div>
          <div style={{marginBottom:marginBottom}}>
            <p1>
              You can replace your submission for this week by submitting again
            </p1>
          </div>
          <div style={{marginBottom:marginBottom}}>
            <p1>
              I encourage you to leave your signature on your work! You deserve the praise! :)
            </p1>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default InfoHover;
