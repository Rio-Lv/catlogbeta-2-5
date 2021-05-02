import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { db } from "../../firebase";
import { Pbox, Tbox, Card } from "./upload/TitleCardStyles";
import { getRGB, getTimeRemaining } from "./upload/functions";
import FadeIn from "react-fade-in";
// takes an object of the challenge of  in format {title:title,timeleft:timeleft}
function ChallengeCard(props) {
  const [W, setW] = useState(1);
  const [base, setBase] = useState(0);
  const [item, setItem] = useState({ title: "", timeleft: 0.0 });
  const [timeleft,setTimeleft] = useState(1000);

  const { R, G, B } = getRGB(item);
  // create the item from mulitple firestore sources
  useEffect(() => {
    db.doc(props.reference)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log(doc.data());
          const title = doc.data().Title;
          const timeleft =
            (doc.data().End - Date.now()) / (doc.data().End - doc.data().Start);
          setTimeleft(2400-timeleft*1000)
          setItem({
            title: title,
            timeleft: timeleft,
          });
        }
      });
  }, [props.reference]);

  // dim after 3s
  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth > 700) {
        setW(0);
        setBase(200);
      }else{
        setW(0);
        setBase(200);
      }
    }, 4200 - 1500 * item.timeleft);
  }, [item.timeleft]);
  return (
    <FadeIn delay={timeleft}>
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
          // console.log(props.reference);
          props.setReference(props.reference);
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Pbox>
            <CircularProgressbar
              className="progressCirle"
              value={item.timeleft * 100}
              text={getTimeRemaining(item).short}
              strokeWidth={12}
              background
              backgroundPadding={11}
              styles={buildStyles({
                rotation: 0.02,
                strokeLinecap: "round",
                textSize: "20px",
                pathTransitionDuration: 0.5,
                backgroundColor: `rgba(${0}, ${0}, ${0}, ${25 / 100})`,
                textColor: `rgba(${R * W + base}, ${G * W + base}, ${
                  B * W + base
                }`,
                pathColor: `rgba(${R * W}, ${G * W}, ${B * W}, ${100 / 100})`,
                trailColor: "none",
              })}
            />
          </Pbox>
          <Tbox
            style={{
              color: `rgba(${R * W + base}, ${G * W + base}, ${B * W + base}`,
            }}
          >
            <div>{item.title}</div>
          </Tbox>
        </div>
      </Card>
    </FadeIn>
  );
}

export default ChallengeCard;
