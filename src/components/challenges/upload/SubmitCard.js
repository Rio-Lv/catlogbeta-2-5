import React, { useState, useEffect } from "react";
import { getRGBcore, handleUpload } from "./functions";
import { Submit } from "./submitStyles";

function SubmitCard(props) {
  // props from upload js
  const [base, setBase] = useState(0);
  const [W, setW] = useState(1);

  const timeleft = ((props.item.end - Date.now())/props.item.cycleLength).toFixed(3)
  const { R, G, B } = getRGBcore(timeleft);

  useEffect(() => {
    console.log('from submit Card')
    console.log(props.item)
    setTimeout(() => {
      if (window.innerWidth > 600) {
        setW(0);
        setBase(200);
      }

    }, 3000 - 1500 * timeleft);
  }, []);

  return (
    <div>
      {props.acceptImage ? (
        <Submit
          style={{
            border: `3px solid rgba(${R * W}, ${G * W}, ${B * W}`,
            color: `rgba(${R * W + base}, ${G * W + base}, ${B * W + base}`,
          }}
          onMouseEnter={() => {
            // console.log('Mouse Enter')

            setBase(0);
            setW(1.5);
          }}
          onMouseLeave={() => {
            // console.log('Mouse Leave')
            setBase(200);
            setW(0);
          }}
          onClick={() => {
            console.log(props.item.Cycle);
            handleUpload(
              props.image,
              props.smallImage,
              props.user,
              props.item,
              props.setImage    
            );  
            props.setSelected("My Gallery");
          }}
        >
          Click to Submit
        </Submit>
      ) : (
        <Submit
          style={{
            border: `3px solid rgba(${R * W}, ${G * W}, ${B * W}`,
            color: `rgba(${100}, ${100}, ${100}`,
          }}
          onMouseEnter={() => {
            // console.log('Mouse Enter')
            setBase(0);
            setW(1.5);
          }}
          onMouseLeave={() => {
            // console.log('Mouse Leave')
            setBase(200);
            setW(0);
          }}
          onClick={() => {
            alert("cannot accept image");
          }}
        >
          Click to Submit
        </Submit>
      )}
    </div>
  );
}

export default SubmitCard;
