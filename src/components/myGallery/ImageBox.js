import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import { getRGBcore } from "./functions";

const imageWidth = 300;
const pad = 3;
const Box = styled.div`
  width: ${imageWidth}px;
  height: ${imageWidth + 34}px;
  margin: ${pad}px;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 0.5s ease;
  background-color: black;

  @media (max-width: 600px) {
    position: static;
    transform: translate(
      ${window.innerWidth / 2 - (imageWidth + pad * 4) / 2 - pad * 2}px,
      0
    );
  }
`;

const Text = styled.div`
  height: 30px;
  background-color: #1a1a1a;
  position: relative;
  left: 0px;
  width: 100%;
  /* top: 300px; */
  padding-bottom: 4px;
  font-family: "Montserrat", sans-serif;
  font-size: 20px;
  text-align: center;
  font-weight: 500;
  line-height: 36px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: 0.6s ease;
`;

// gets image from firestore reference

function ImageBox(props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [timeleft, setTimeleft] = useState(0);

  const [base, setBase] = useState(50);
  const [W, setW] = useState(1);
  const [WB, setWB] = useState(1);

  const [color, setColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [background, setBackground] = useState("white");

  const [height, setHeight] = useState(0);
  const [height2, setHeight2] = useState(30);
  const [opacity, setOpacity] = useState(0);

  const [hoverable, setHoverable] = useState(false);

  const { R, G, B } = getRGBcore(timeleft); // for some reason, offsetting the time left fixes the color sync with challenges

  // delay image grow animation
  useEffect(() => {
    setTimeout(() => {
      setHeight(imageWidth);
      setHeight2(imageWidth);
      setTimeout(() => {
        setOpacity(1);
        setTimeout(() => {
          setW(10);
          setWB(0);
          setHoverable(true);
        }, 1200);
      }, 500 + timeleft * 1000);
    }, 1000);
  }, []);
  useEffect(() => {
    // console.log(props.reference)
    try {
      db.doc(props.reference).onSnapshot((doc) => {
        // console.log("displaying from submissions Sub Image box");
        // console.log(doc.data().cycle);
        if (doc.exists) {
          const timeleft = (
            (doc.data().end - Date.now()) /
            doc.data().cycleLength
          ).toFixed(3);

          // console.log(timeleft)

          setTimeleft(timeleft);
          setUrl(doc.data().urlSmall);
          setTitle(doc.data().title);
        } else {
          setTimeleft(0);
          setUrl("");
          setTitle("OOPS");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [props.reference]);
  return (
    <Box
      style={{
        height: `${height2 + 34}px `,
        border:
          timeleft > 0
            ? `4px solid rgba(${R * WB}, ${G * WB}, ${B * WB}`
            : `4px solid${borderColor}`,
      }}
      onMouseEnter={() => {
        if (hoverable) {
          setBorderColor("#ff8800");
          setColor("#ff8800");
          setBase(0);
          setW(1.5);
          setWB(1.5);
        }
      }}
      onMouseLeave={() => {
        if (hoverable) {
          setBorderColor("#ffffff");
          setColor("#000000");
          setBase(50);
          setW(100);
          setWB(0);
        }
      }}
      onClick={() => {
        console.log("imageBox clicked");
        console.log("props.reference");
        console.log(props.reference);
        props.setReference(props.reference);
      }}
    >
      <div>
        <img
          style={{
            opacity: `${opacity}`,
            position: "fixed",
            height: `${imageWidth}px`,
            width: `${imageWidth}px`,
            borderTopRightRadius: "1px",
            borderTopLeftRadius: "1px",
            transition: "0.4s ease",
          }}
          src={url}
          alt=""
        />
      </div>

      <Text
        style={{
          top: `${height}px`,
          color:
            timeleft > 0
              ? `rgba(${R * W + base}, ${G * W + base}, ${B * W + base}`
              : color,
          backgroundColor: timeleft > 0 ? "#1a1a1a" : background,
          left: timeleft > 0 ? "0px" : "-1px",
          width: timeleft > 0 ? "100%" : "100.7%",
          fontWeight: timeleft > 0 ? "400" : "700",
        }}
      >
        {title.toUpperCase()}
      </Text>
    </Box>
  );
}

export default ImageBox;
