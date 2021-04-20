import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {db} from '../../firebase'
import { getRGBcore } from "./functions";

const imageWidth = 300;
const pad = 10;
const Box = styled.div`
  width: ${imageWidth}px;
  height: ${imageWidth + 44}px;
  margin: ${pad}px;
  border-radius: 8px;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 0.5s ease;

  @media (max-width: 600px) {
    position: static;
    transform: translate(
      ${window.innerWidth / 2 - (imageWidth + pad) / 2 - pad * 2}px,
      0
    );
  }
`;

const Text = styled.div`
  background-color: #1a1a1a;
  position: relative;
  left: 0px;
  top: 300px;
  padding-bottom: 4px;
  font-size: 30px;
  text-align: center;
  line-height: 40px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: 0.3s ease;
`;

// gets image from firestore reference

function ImageBox(props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [timeleft, setTimeleft] = useState(0);

  const [base, setBase] = useState(50);
  const [W, setW] = useState(1);

  const [color, setColor] = useState("#ffd6a0");
  const [borderColor, setBorderColor] = useState("#000000");
  
  const { R, G, B } = getRGBcore(timeleft);// for some reason, offsetting the time left fixes the color sync with challenges

  useEffect(() => {
    // console.log(props.reference)
    try {
      db.doc(props.reference).onSnapshot((doc) => {
        // console.log("displaying from submissions Sub Image box");
        // console.log(doc.data().cycle);
        const timeleft = ((doc.data().end - Date.now())/doc.data().cycleLength).toFixed(3)

        // console.log(timeleft)

        setTimeleft(timeleft);
        setUrl(doc.data().urlSmall);
        setTitle(doc.data().title);
      });
    } catch (err) {
      console.log(err);
    }
  }, [props.reference]);
  return (
    <Box
      style={{ border:timeleft>0? `3px solid rgba(${R * W}, ${G * W}, ${B * W}`:`3px solid${borderColor}` }}
      onMouseEnter={() => {
        setBorderColor("#ff8800");
        setColor("#ff8800");
        setBase(0);
        setW(1.5);
      }}
      onMouseLeave={() => {
        setBorderColor("#000000");
        setColor("#ffd6a0");
        setBase(50);
        setW(0.7);
      }}
      onClick = {()=>{
        console.log('imageBox clicked')
        console.log('props.reference')
        console.log(props.reference)
        props.setReference(props.reference);
      }}
    >
      <div>
        <img
          style={{
            position: "fixed",
            width: `${imageWidth}px`,
            borderTopRightRadius: "5px",
            borderTopLeftRadius: "5px",
          }}
          src={url}
          alt=""
        />
      </div>

      <Text style={{  color: timeleft>0?`rgba(${R * W + base}, ${G * W + base}, ${B * W + base}`:color }}>{title}</Text>
    </Box>
  );
}

export default ImageBox;
