import React, { useEffect, useState } from "react";
import { Box, Row } from "./styles";
import FadeIn from "react-fade-in";
import ImageBox from "./ImageBox";

function Grid(props) {
  const [N, setN] = useState(3);
  const [boxes, setBoxes] = useState([]);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setN(1);
    }
    const array = [];
    var row = [];
    if (props.references !== null) {
      try {
        for (let i = 0; i < props.references.length; i++) {
          row.push(<ImageBox reference={props.references[i]}></ImageBox>);
          if ((i + 1) % N === 0 || i + 1 === props.references.length) {
            array.push(<Row>{row}</Row>);
            console.log(i);
            row = [];
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    setBoxes(array);
  }, [props.references]);
  return (
    <div>
      <Box>
        <FadeIn>{boxes}</FadeIn>
      </Box>
    </div>
  );
}

export default Grid;
