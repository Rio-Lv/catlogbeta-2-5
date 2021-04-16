import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import styled from "styled-components";
import FadeIn from "react-fade-in";

const Box = styled.div`
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
  }
`;
const CenterBox = styled.div`
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 900px;
  /* height:${window.innerHeight - 100}px; */
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  /* border: 3px solid #333333; */
  @media (max-width: 900px) {
    top: 0%;
    width: 98%;
    transform: translate(-50%, 40px);
  }
`;
const ImageBox = styled.div`
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 5px;
  margin-bottom: 5px;
  padding-top: 100%;
  width: 100%;
  /* box-shadow:1px 1px 3px 2px; */
  border: 1px solid #ffffff;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: contain;
  transition: 0.3s ease;
`;

function CloseUP(props) {
  //props from grid
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (props.reference !== "") {
      db.doc(props.reference)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("document in CloseUp");
            console.log(doc.data());
            setUrl(doc.data().url);
          } else {
            console.log("doc not found in close UP");
          }
        });
    }
  }, [props.reference]);
  return (
    <div>
      <Box />
      <CenterBox>
        <FadeIn>
          <ImageBox
            style={{
              backgroundImage: `url(${url})`,
            }}
            onClick={() => {
              props.setReference("");
            }}
          ></ImageBox>
        </FadeIn>
      </CenterBox>
    </div>
  );
}

export default CloseUP;
