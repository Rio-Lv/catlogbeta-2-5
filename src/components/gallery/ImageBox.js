import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import "./styles.css";
const Name = styled.div`
  display:none;
  font-family: 'Montserrat', sans-serif;
  opacity: 0;
  width: 60%;
  padding-left: 20px;
  height: 30px;
  text-align: left;
  font-size: 20px;
  position: relative;
  color: white;
  background-color: black;
  top: 100%;
  transform: translate(0%, -100%);
  line-height: 30px;
  border-top-right-radius: 20px;
  transition: 0.9s ease;
`;
const Frame = styled.div`
  width: 280px;
  height: 280px;
  background-color: black;
  background-size: cover;
  margin: 2px;
  background-size: cover;
  border-radius: 6px;
  transition: .3s ease;
  &:hover ${Name} {
    opacity: 1;
  }
  @media (max-width: 800px) {
    transform: translate(${0}px, 0%);
  }
`;

function ImageBox(props) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [topThickness, setTopThickeness] = useState(5);
  const [sideThickness, setSideThickness] = useState(155);
  const [borderColor, setBorderColor] = useState("black");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth > 700) {
        setTopThickeness(155);
        setSideThickness(155);

        setTimeout(() => {
          setWidth(280);
          setHeight(280);
          setTopThickeness(15);
          setSideThickness(15);
          setHover(true);
        }, 600);
      } else {
        // mobile
        // setTopThickeness((window.innerWidth - 24) / 2 );
        // setSideThickness((window.innerWidth - 24) / 2 );
        setTimeout(() => {
          setWidth(280);
          setHeight(280);
          setTopThickeness(15);
          setSideThickness(15);
          setHover(true);
        }, 600);
      }
    }, 1500);
  }, []);
  useEffect(() => {
    if (props.reference !== "") {
      console.log(props.reference);
      db.doc(props.reference)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUrl(doc.data().urlSmall);
            setName(doc.data().displayName);
            console.log(doc.data());
          }
        });
    } else {
      console.log("reference undefined or empty");
    }
  }, [props.reference]);
  return (
    <div>
      <Frame
        onMouseEnter={() => {
          if (hover) {
            if (window.innerWidth > 700) {
              setHeight(300);
              setWidth(300);
              setBorderColor("#ffaa3b");
              setTopThickeness(5);
              setSideThickness(5);
            } else {
              setHeight(300);
              setWidth(300);
              setBorderColor("#ffb451");
              setTopThickeness(5);
              setSideThickness(5);
            }
          }
        }}
        onMouseLeave={() => {
          if (hover) {
            if (window.innerWidth > 700) {
              setHeight(280);
              setWidth(280);
              setBorderColor("black");
              setTopThickeness(15);
              setSideThickness(15);
            } else {
              setWidth(280);
              setHeight(280);

              setBorderColor("black");
              setTopThickeness(15);
              setSideThickness(15);
            }
          }
        }}
        style={{
          backgroundImage: `url(${url})`,
          height: `${height}px`,
          width: `${width}px`,
          border: `solid ${borderColor}`,
          borderLeftWidth: `${sideThickness}px `,
          borderRightWidth: `${sideThickness}px`,
          borderTopWidth: `${topThickness}px `,
          borderBottomWidth: `${topThickness}px `,
        }}
      >
        <Name style={{display:hover?"block":"none"}}>{name}</Name>
      </Frame>
    </div>
  );
}

export default ImageBox;
