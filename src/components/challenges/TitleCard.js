import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Pbox,Tbox,Tbox2,Card} from './TitleCardStyles'
import {getRGB,getTimeRemaining} from './upload/functions'
// takes an object of the challenge of  in format {title:title,timeleft:timeleft}
function TitleCard(props) {
  const [W, setW] = useState(1);
  const [base,setBase] = useState(0);
  const [complete, setComplete] = useState(true);
  // this equation calculates how close two percentages are to each other

  const { R, G, B } = getRGB(props.item); 
  // dim after 3s
  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth > 600) {
        setW(0);
        setBase(200)
      }
    }, 3000 - 1500 * props.item.timeleft);
  },[]);
  return (
    <Card
      style={{
        border: `3px solid rgba(${R * W}, ${G * W}, ${B * W}`,
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
        props.func();
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Pbox>
          <CircularProgressbar
            className="progressCirle"
            value={props.item.timeleft * 100}
            text={getTimeRemaining(props.item).short}
            strokeWidth={12}
            background
            backgroundPadding={11}
            
            styles={buildStyles({
              rotation: 0.02,
              strokeLinecap: "round",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              backgroundColor: `rgba(${0}, ${0}, ${0}, ${25 / 100})`,
              textColor: `rgba(${R * W+base}, ${G * W+base}, ${B * W+base}`,
              pathColor: `rgba(${R * W}, ${G * W}, ${B * W}, ${100 / 100})`,
              trailColor: "none",
            })}
          />
        </Pbox>
        <Tbox
          style={{
            color: `rgba(${R * W+base}, ${G * W+base}, ${B * W+base}`,
          }}
        >
          <div>{props.item.title}</div>
        </Tbox>
        {complete ? (
          <Tbox2
            style={{
              fontSize: `${12}px`,
              color: `rgba(${R * W+base}, ${G * W+base}, ${B * W+base}`,
            }}
          >
            <div>complete</div>
          </Tbox2>
        ) : (
          <Tbox2
            style={{
              fontSize: `${12}px`,
              color: "grey",
            }}
          >
            {/* <div>{getTimeRemaining(props.item).verbose}</div> */}
            <div>incomplete</div>
          </Tbox2>
        )}
      </div>
    </Card>
  );
}

export default TitleCard;
