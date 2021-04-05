import React, { useState, useEffect } from "react";
import { getRGB, handleUpload } from "./functions";
import { Submit } from "./submitStyles";

function SubmitCard(props) {
  const [base, setBase] = useState(0);
  const [W, setW] = useState(1);
  const { R, G, B } = getRGB(props.item);

  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth > 600) {
        setW(0);
        setBase(200);
      }
    }, 3000 - 1500 * props.item.timeleft);
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
            console.log(props.item.cycle);
            handleUpload(
              props.image,
              props.user,
              props.item.cycle,
              props.item.title,
              props.setImage
            );
            props.setSelected("home");
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
