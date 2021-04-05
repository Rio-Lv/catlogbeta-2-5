import React, { useState } from "react";
import styled from "styled-components";
// import * as t from "../tools";
import FadeIn from "react-fade-in";
import TitleCard from './TitleCard';
import Upload from './Upload';


const TitleBox = styled.div`
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 600px;
  /* height:${window.innerHeight - 100}px; */
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  /* border: 3px solid #333333; */
  @media (max-width: 600px) {
    width: 95%;
    top: 60px;
    transform: translate(-50%, 10px);
  }
`;
const syncChallenges = [
  { title: "cat on hat", timeleft: .95,cycle:7 },
  { title: "cloth sloth", timeleft: .75 ,cycle:6},
  { title: "grass ball", timeleft: .60 ,cycle:5},
  { title: "clay glove", timeleft: .45 ,cycle:4},
  { title: "wall bat", timeleft: .30 ,cycle:3},
  { title: "fat pillow", timeleft: .1 ,cycle:2},
  { title: "power towerssds", timeleft: .0021 ,cycle:1},
];

function Challenges(props) {
  const [upload, setUpload] = useState(false);
  const [item ,setItem] = useState(null);
  const createCards = (array) => {
    const cards = [];
    array.forEach((item) => {
      const func = () => {
        console.log("running test function");
        setUpload(true);
        setItem(item);
      };
      const card = <TitleCard item={item} func={func}/>
      
      cards.push(card);
    });
    return cards;
  };
  return (
    <div>
      <TitleBox>
        {upload?
        <Upload item = {item} setUpload = {setUpload} setSelected={props.setSelected}></Upload>
        :
        <FadeIn>{createCards(syncChallenges)}</FadeIn>
        }
      </TitleBox>
    </div>
  );
}
export default Challenges;
