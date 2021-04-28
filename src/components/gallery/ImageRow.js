import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";
import ImageBox from "./ImageBox";

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
  background-color: #111111;
  border-radius: 3px;
  border: 3px solid #000000;
  text-align:center;
  margin-top: 15px;
  margin-left: 0px;
  margin-right: 0px;
  padding: 3px;
`;

const Title = styled.div`
 
  margin-bottom: 3px;
  font-size: 26px;
  line-height: 45px;
  height: 45px;
  color: #ffae00;
  width: 100%;
  background-color: #000000;
`;
function ImageRow(props) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [title, setTitle] = useState("");

  useEffect(() => {
    console.log(props.cycle);
    if (props.cycle !== undefined) {
      db.doc(`Winners/${props.cycle}`)
        .get()
        .then((doc) => {
          const References = doc.data().References;
          console.log(References);
          setFirst(References[0]);
          setSecond(References[1]);
          setThird(References[2]);
        });

      db.doc(`Challenges/Cycle_${props.cycle}`)
        .get()
        .then((item) => {
          if (item.exists) {
            setTitle(item.data().Title);
          }
        });
    }
  }, [props.cycle]);
  return (
    <div>
      <RowBox>
        <Title>{title.toUpperCase()}</Title>
        <Row>
          <ImageBox reference={first}></ImageBox>
          <ImageBox reference={second}></ImageBox>
          <ImageBox reference={third}></ImageBox>
        </Row>
      </RowBox>
    </div>
  );
}

export default ImageRow;
