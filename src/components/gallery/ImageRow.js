import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";
import ImageBox from "./ImageBox";
import "./styles.css";

const Row = styled.div`
  display: flex;
  flex-direction: horizontal;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
const RowBox = styled.div`
  
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  border-radius: 3px;
  border: 3px solid #000000;
  text-align: center;
  margin-top: 5px;
  margin-left: 0px;
  margin-right: 0px;
  padding: 3px;
`;

const Title = styled.div`
  font-family: "Montserrat", sans-serif;
  margin-bottom: 3px;
  font-size: 26px;
  line-height: 32px;
  height: 30px;
  color: #fdfdfd;
  width: 100%;
  /* background-color: #000000; */
`;
function ImageRow(props) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(window.innerWidth>700?true:false);

  useEffect(() => {
    db.doc(`Winners/${props.cycle}`)
      .get()
      .then((doc) => {
        setFirst(doc.data().top3paths[0]);
        setSecond(doc.data().top3paths[1]);
        setThird(doc.data().top3paths[2]);
      });
  }, [props.cycle]);

  useEffect(() => {
    db.doc(`Challenges/Cycle_${props.cycle}`)
      .get()
      .then((doc) => {
        setTitle(doc.data().Title);
      });
  }, [props.cycle]);

 

  return (
    <div>
      <RowBox>
        <Title
          
          onClick={() => {
            console.log("title has been clicked");
            if(expanded){
              setExpanded(false)
            }else{
              setExpanded(true)
            }
          }}
        >
          {title}
        </Title>
        <Row>
          <ImageBox reference={first}></ImageBox>
          {expanded ? (
            <div style = {{display:"flex",flexDirection:window.innerWidth>700?"horizontal":"column"}}>
              <ImageBox reference={second}></ImageBox>
              <ImageBox reference={third}></ImageBox>
            </div>
          ) : null}
        </Row>
      </RowBox>
    </div>
  );
}

export default ImageRow;
