import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";
import ImageRow from "./ImageRow";
import FadeIn from "react-fade-in";
import "./styles.css";

const InvisibleBox = styled.div`
  position: fixed;
  overflow: scroll;
  width: 1200px;
  height: ${window.innerHeight + 100}px;
  left: 50%;
  transform: translate(-49.255%, 0px);
  background: rgb(0, 0, 0, 0);
  transition: 0.8s ease;
  /* border: 3px solid #0252ff; */
  @media (max-width: 800px) {
    width: 110%;
    transform: translate(-50%, 0px);
    height: ${window.innerHeight}px;
  }
`;

const CenterBox = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  /* background-color: #2c2c2c; */
  text-align: center;
  position: fixed;
  transition: 1s ease;
  left: 50%;
  transform: translate(-50%, 185px);
  border-radius: 5px;
  /* border: 3px solid red; */
  @media (max-width: 800px) {
    left: 50%;
    transform: translate(-48.5%, 135px);
    position:absolute;
  }

`;

const Title = styled.div`
  position: fixed;
  text-align: center;
  width: 100%;
  top: 100px;
  left: 50%;
  font-family: "Great Vibes", cursive;
  transform: translate(-50%, 0);
  line-height: 87px;
  height: 80px;
  color: #f4faff;
  font-size: 64px;

  transition: 1s ease;

  background-color: #111111;
  border-radius: 3px;
  /* border: 3px solid #000000; */
  @media (max-width: 800px) {
    top: 50px;
    width: 98%;
  }
`;

function Gallery() {
  const [cycles, setCycles] = useState([]);
  const [rows, setRows] = useState();
  useEffect(() => {
    db.doc("Sync/OpenToFame").onSnapshot((doc) => {
      if (doc.exists) {
        setCycles(doc.data().OpenToFame);
        // console.log(doc.data())
      } else {
        console.log("not found");
      }
    });
  }, []);
  useEffect(() => {
    console.log("cycles");
    console.log(cycles);
    const array = [];
    cycles.forEach((cycle) => {
      array.unshift(<ImageRow cycle={cycle}></ImageRow>);
    });
    setRows(array);
  }, [cycles]);
  useEffect(() => {
    setTimeout(() => {
      const title = document.getElementById("HallOfFameTitle").style;
      const invisible = document.getElementById("HallOfFameInvisible").style;
      const center = document.getElementById("HallOfFameCenter").style;

      center.top = "0px";

      if (window.innerWidth > 700) {
        title.borderTopRightRadius = "0px";
        title.borderTopLeftRadius = "0px";
        title.borderBottomLeftRadius = "35px";
        title.borderBottomRightRadius = "35px";
        title.fontWeight = "800";

        title.top = "-1px";
        title.width = "400px";
        title.color = "black";
        title.border = "3px solid transparent";
        title.backgroundColor = "#fff8f2";
        title.fontSize = "48px";
        title.height = "60px";
        title.lineHeight = "62px";

        setTimeout(() => {
          center.top = "-120px";
          // invisible.background ="rgb(0,0,0,0.4)";
        }, 700);
      } else {
        title.left = "150px";
        title.width = `${window.innerWidth - 170}px `;
        title.width = "600px";
        title.border = "3px solid white";
        title.borderTopRightRadius = "10px";
        title.borderTopLeftRadius = "10px";
        title.borderBottomLeftRadius = "10px";
        title.borderBottomRightRadius = "10px";

        title.top = "0px";

        title.color = "black";
        title.backgroundColor = "#ffffff";
        title.fontSize = "24px";
        title.fontWeight = "800";
        title.height = "36px";
        title.lineHeight = "42px";

        setTimeout(() => {
          center.top = "-99px";
        }, 500);
      }
    }, 1000);
  }, []);
  return (
    <div>
      <InvisibleBox id="HallOfFameInvisible">
        <CenterBox id="HallOfFameCenter">
          <div>
            <FadeIn>{rows}</FadeIn>
            <div style={{ height: "1000px" }}></div>
          </div>
        </CenterBox>
      </InvisibleBox>
      <FadeIn>
        <Title id="HallOfFameTitle">
          <div>Hall of Fame</div>
        </Title>
      </FadeIn>
    </div>
  );
}

export default Gallery;
