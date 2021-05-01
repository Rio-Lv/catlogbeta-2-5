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
  useEffect(()=>{
    const center = document.getElementById("MyGalleryCenter").style
    if(window.innerWidth>700){

      center.transform = "translate(0,130px)"
      setTimeout(()=>{
        center.transform = "translate(0,20px)"
      },1500)
    }else{
      center.top = "130px"
      setTimeout(()=>{
        center.top = "0px"
      },1500)
    }
  },[])
  return (
    <div>
      {closeUp ? (
        <CloseUp reference={reference} setReference={setReference}></CloseUp>
      ) : (
        <div>
          <Box
            style={{
              backgroundColor: "black",
              opacity: window.innerWidth > 700 ? "0%" : "35%",
            }}
          ></Box>
          <Box>
            <div style={{position:window.innerWidth<700?"fixed":"static",transition:".8s ease"}}id="MyGalleryCenter">
              <FadeIn>{boxes}</FadeIn>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}

export default Grid;
