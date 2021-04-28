import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";
import ImageRow from "./ImageRow";
import "./styles.css"

const InvisibleBox = styled.div`
  position:fixed;
  overflow: scroll;
  width: 1200px;
  height: ${900}px;
  left: 50%;
  transform: translate(-50%, 50px);
  border:3px solid black;
  @media(max-width:800px){
    width: 110%;
    transform: translate(-50%, 40px);
  }
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  /* background-color: #2c2c2c; */
  text-align: center;
  position: fixed;

  left: 50%;
  transform: translate(-50%, 0%);
  border-radius: 5px;
  border: 3px solid transparent;
  @media(max-width:800px){
    width: ${window.innerWidth-2}px;
    left: 50%;
    transform: translate(-${window.innerWidth/2-6}px, 0%);
  }
`;

const Title = styled.div`
  font-family: 'Great Vibes', cursive;
  transform: translate(-0px, 0);
  line-height: 95px;
  height: 90px;
  color: #ffa319;
  font-size: 64px;
  width: 99.6%;
  background-color: #181818;
  border-radius: 3px;
  border: 2px solid #000000;
  @media(max-width:800px){
    width:98%
  }
`;

function Gallery() {
  const [cycles, setCycles] = useState([]);
  const [rows, setRows] = useState();
  useEffect(() => {
    db.doc("Sync/OpenToSort").onSnapshot((doc) => {
      if (doc.exists) {
        setCycles(doc.data().OpenToSort);
      } else {
        console.log("not found");
      }
    });
  }, []);
  useEffect(() => {
    console.log(cycles);
  }, [cycles]);
  return (
    <div>
      <InvisibleBox>
        <CenterBox>
          <div>
            <Title> Hall of Fame </Title>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
            <ImageRow cycle={cycles[0]}></ImageRow>
          </div>
        </CenterBox>
      </InvisibleBox>
      
    </div>
  );
}

export default Gallery;
