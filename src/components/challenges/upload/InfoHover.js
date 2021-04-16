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
              Images should be a perfect square within 1500px to 3500px length
            </p1>
          </div >
          <div style={{marginBottom:marginBottom}}>
            <p1>
              If the images arent squares they will be resized(not cropped) into
              squares, ps... please do your own crop, its hard to code it in :(
            </p1>
          </div>
          <div style={{marginBottom:marginBottom}}>
            <p1>
              You can replace your submission for this week by submitting again
            </p1>
          </div>
          <div style={{marginBottom:marginBottom}}>
            <p1>
              I encourage you to leave your signature on your work! 
            </p1>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default InfoHover;
