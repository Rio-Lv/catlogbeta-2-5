import React, { useEffect, useState } from "react";
import { Box, Row } from "./styles";
import FadeIn from "react-fade-in";
import ImageBox from "./ImageBox";
import CloseUp from "./closeUp/CloseUp";

function Grid(props) {
  // props from MyGallery
  const [N, setN] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [closeUp, setCloseUp] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (reference !== "") {
      setCloseUp(true);
      console.log(reference);
    } else {
      setCloseUp(false);
    }
  }, [reference]);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setN(1);
    }
    const array = [];
    var row = [];
    if (props.references !== "") {
      try {
        for (let i = 0; i < props.references.length; i++) {
          row.push(
            <ImageBox
              reference={props.references[props.references.length - i - 1]}
              setReference={setReference}
            ></ImageBox>
          );
          if ((i + 1) % N === 0 || i + 1 === props.references.length) {
            array.push(<Row>{row}</Row>);
            // console.log(i);
            row = [];
          }
        }
      } catch (err) {
        // console.log(err);
      }
    }
    setBoxes(array);
  }, [props.references, N]);
  useEffect(() => {
    const center = document.getElementById("MyGalleryCenter").style;

    if (window.innerWidth > 700) {
      center.transform = "translate(0,117px)";
      setTimeout(() => {
        center.transform = "translate(0,25px)";
      }, 1500);
    } else {
      center.top = "70px";
      setTimeout(() => {
        center.top = "0px";
      }, 1500);
    }
  }, []);
  return (
    <div>
      {closeUp ? (
        <CloseUp reference={reference} setReference={setReference}></CloseUp>
      ) : (
        <Box
          style={{
            // border: "3px solid blue",
            top: "-10px",
            height: "105%",
          }}
        >
          <div
            style={{
              // border:"3px solid red",
              transform:
                window.innerWidth > 700
                  ? "translate(0,280px)"
                  : "translate(0,50px)",
              position: window.innerWidth < 700 ? "fixed" : "static",
              transition: ".8s ease",
            }}
            id="MyGalleryCenter"
          >
            <FadeIn>
              <div style={{ height: window.innerWidth>700? "70px": "32px"}}></div>
              {boxes}
            </FadeIn>
            <div style={{ height: "100px" }}></div>
          </div>
        </Box>
      )}
    </div>
  );
}

export default Grid;
