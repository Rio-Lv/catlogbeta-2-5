import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageBox from "./ImageBox";
import firebase from "firebase";
import { db } from "../../firebase";

const increment = firebase.firestore.FieldValue.increment(1);

const BackBox = styled.div`
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 70px;
  display: flex;
  flex-direction: column;
  /* background-color: #6d6d6d; */
  overflow: scroll;
  @media (max-width: 600px) {
    display: block;
    height: 98%;
    width: 99%;
    top: 65px;
    transform: translate(-50%, -3%);
    border: 2px solid #000000;
    border-radius: 5px;
    transition: 1s ease;
  }
`;
const BackBoxShade = styled.div`
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 70px;
  display: flex;
  flex-direction: column;
  /* background-color: #6d6d6d; */
  overflow: scroll;
  background-color: black;
  opacity: 30%;
  @media (max-width: 600px) {
    display: block;
    height: 98%;
    width: 99%;
    top: 65px;
    transform: translate(-50%, -3%);
    border: 2px solid #000000;
    border-radius: 5px;
    transition: 1s ease;
  }
`;
const SmallerBox = styled.div`
  display: flex;
  flex-direction: horizontal;
  width: 100%;
  background-color: #202020;
  border-radius: 5px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
const Box = styled.div`
  border: 1px solid #111111;
  border-radius: 7px;
  background-color: #111111;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 800px) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  }
  @media (max-height: 640px) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -47%);
  }
`;
const Title = styled.div`
  transition: 0.5s ease;
  position: relative;
  width: 100%;
  height: 35px;
  font-size: 24px;
  color: white;
  text-align: center;
  &:hover {
    color: #76a4fa;
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

  const voteFunc = (path) => {
    console.log("running vot function");
    console.log("leftPath: " + leftPath);
    console.log("rightPath: " + rightPath);
    if (path === leftPath) {
      db.doc(leftPath).set({ wins: increment }, { merge: true });
      db.doc(rightPath).set({ losses: increment }, { merge: true });
    } else if (path === rightPath) {
      db.doc(leftPath).set({ losses: increment }, { merge: true });
      db.doc(rightPath).set({ wins: increment }, { merge: true });
    } else {
      console.log("no path matches");
    }
  };

  return (
    <div>
      {window.innerWidth > 800 ? (
        <div>
          <Box>
            <Title>{props.title.toUpperCase()}</Title>
            <SmallerBox>
              <ImageBox
                path={leftPath}
                shuffle={props.shuffle}
                voteFunc={voteFunc}
              ></ImageBox>
              <ImageBox
                path={rightPath}
                shuffle={props.shuffle}
                voteFunc={voteFunc}
              ></ImageBox>
            </SmallerBox>
          </Box>
        </div>
      ) : (
        <div>
          <BackBox></BackBox>
          <BackBoxShade></BackBoxShade>
          <Box style={{ border: "0px" }}>
            <SmallerBox>
              <ImageBox
                path={leftPath}
                shuffle={props.shuffle}
                voteFunc={voteFunc}
              ></ImageBox>
              <Title>{props.title}</Title>
              <ImageBox
                path={rightPath}
                shuffle={props.shuffle}
                voteFunc={voteFunc}
              ></ImageBox>
            </SmallerBox>
          </Box>
        </div>
      )}
    </div>
  );
}

export default VoteBox;
