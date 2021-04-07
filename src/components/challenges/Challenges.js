import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import * as t from "../tools";
import FadeIn from "react-fade-in";
import TitleCard from "./TitleCard";
import Upload from "./Upload";
import { db } from "../../firebase";

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
// using this as a template to create from firestore
const syncChallenges = [
  { title: "cat on hat", timeleft: 0.95, cycle: 7 },
  { title: "cloth sloth", timeleft: 0.75, cycle: 6 },
  { title: "grass ball", timeleft: 0.6, cycle: 5 },
  { title: "clay glove", timeleft: 0.45, cycle: 4 },
  { title: "wall bat", timeleft: 0.3, cycle: 3 },
  { title: "fat pillow", timeleft: 0.1, cycle: 2 },
  { title: "power towerssds", timeleft: 0.0021, cycle: 1 },
];

function Challenges(props) {
  const [upload, setUpload] = useState(false);
  const [item, setItem] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [challengeCards, setChallengeCards] = useState([]);

  useEffect(() => {
    db.collection("Sync")
      .doc("OpenToSubmit")
      .onSnapshot((doc) => {
        const OpenToSubmit = doc.data().OpenToSubmit; //gives an array of strings for referering to the submissions
        const array = [];
        for (let i = 0; i < OpenToSubmit.length; i++) {
          db.doc(OpenToSubmit[i])
            .get()
            .then((doc) => {
              const timeleft =
                (doc.data().End - Date.now()) / doc.data().CycleLength;

              array.push({
                title: doc.data().Title,
                timeleft: timeleft.toFixed(2),
              });
            });
        }
        // console.log(array)
        setChallenges(array);
      });
  }, []);

  const createCards = (array) => {
    const cards = [];
    array.forEach((item) => {
      const func = () => {
        console.log("running test function");
        setUpload(true);
        setItem(item);
      };
      const card = <TitleCard item={item} func={func} />;

      cards.push(card);
    });
    return cards;
  };
  useEffect(() => {
    console.log(syncChallenges);
    console.log(challenges[1]);
    setChallengeCards(createCards(syncChallenges));
  }, [challenges]);

  return (
    <div>
      <TitleBox>
        {upload ? (
          <Upload
            item={item}
            setUpload={setUpload}
            setSelected={props.setSelected}
          ></Upload>
        ) : (
          <FadeIn>{challengeCards}</FadeIn>
        )}
      </TitleBox>
    </div>
  );
}
export default Challenges;
