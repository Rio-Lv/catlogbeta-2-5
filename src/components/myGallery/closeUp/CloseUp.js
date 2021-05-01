import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import styled from "styled-components";
import FadeIn from "react-fade-in";

import Upload from "../../challenges/upload/Upload";

const InfoBar = styled.div`
  position: fixed;
  width: 100%;
  height: 35px;
  opacity: 0;
  transition: 0.7s;

  /* border: 3px solid #111111; */
`;
const Title = styled.div`
  background-color: #111111;
  color: "#fff6ee";
  
  text-align: center;
  line-height: 28px;
  position: fixed;
  width: 400px;
  height: 35px;
  font-size: 24px;
  transform: translate(-1px, -5px);
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  transition:0.7s ease;
`;
const Edit = styled.button`
  transform: translate(1px, -5px);
  background-color: #111111;
  border: 0px solid #111111;
  color: #c05d00;
  text-align: center;
  line-height: 28px;
  position: fixed;
  right: 0px;
  width: 100px;
  height: 35px;
  font-size: 20px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  transition:0.7s ease;
  &:hover{
    background-color:#b34e1f;
    color:white;
  }
`;

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
  width: 850px;
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
  border: 1px solid #000000;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-repeat: no-repeat;
  background-size: contain;
  transition: 0.5s ease;
`;

function CloseUP(props) {
  //props from grid
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [hover, setHover] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{setHover(true)},1500)
  },[])
  useEffect(() => {
    if (props.reference !== "") {
      db.doc(props.reference)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("document in CloseUp");
            console.log(doc.data());
            setUrl(doc.data().url);
            setTitle(doc.data().title);
          } else {
            console.log("doc not found in close UP");
          }
        });
    }
  }, [props.reference]);
  return (
    <div>
      <div>
        <Box />
        <CenterBox
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <FadeIn>
            <ImageBox
              style={{
                backgroundImage: `url(${url})`,
                borderTopLeftRadius: hover ? "5px" : "10px",
                borderTopRightRadius: hover ? "5px" : "10px",
                borderBottomLeftRadius: hover ? "0px" : "10px",
                borderBottomRightRadius: hover ? "0px" : "10px",
              }}
              onClick={() => {
                props.setReference("");
              }}
            ></ImageBox>
          </FadeIn>

          <InfoBar style={{ opacity: hover ? "1" : "0" }}>
            <Title
              style={{
                color:"#fff6ee",
                borderTopLeftRadius: hover ? "0px" : "5px",
                borderTopRightRadius: hover ? "0px" : "5px",
                transform: hover ? "translate(-1px,-5px)" : "translate(-1px,3px)"
              }}
            >
              {title}
            </Title>
            <Edit
              onClick={() => {
                props.setReference("");
              }}
              style={{
                borderTopLeftRadius: hover ? "0px" : "5px",
                borderTopRightRadius: hover ? "0px" : "5px",
                transform: hover ? "translate(1px,-5px)" : "translate(1px,3px)"
              }}
            >
              Back
            </Edit>
          </InfoBar>
        </CenterBox>
      </div>
    </div>
  );
}

export default CloseUP;
