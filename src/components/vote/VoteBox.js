import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageBox from "./ImageBox";
const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: horizontal;
  background-color: #2b2b2b;
  border-radius: 5px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
function VoteBox(props) {
  const [leftPath, setLeftPath] = useState("");
  const [rightPath, setRightPath] = useState("");

  // get the paths from props on load in
  useEffect(() => {
    setLeftPath(props.LeftPath);
    setRightPath(props.RightPath);
  }, [props.LeftPath, props.RightPath]);

  useEffect(() => {
    // console.log(leftPath)
    // console.log(rightPath)
  }, [leftPath, rightPath]);

  return (
    <div>
      <Box>
        <ImageBox
          path={leftPath}
          shuffle={props.shuffle}
        ></ImageBox>
        <ImageBox
         
          hover={false}
          path={rightPath}
          shuffle={props.shuffle}
        ></ImageBox>
      </Box>
    </div>
  );
}

export default VoteBox;
