import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import * as t from "../tools";
import FadeIn from "react-fade-in";
import ChallengeCards from "./ChallengeCards";
import Upload from "./upload/Upload";
import { db } from "../../firebase";

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

function Challenges(props) {
  const [upload, setUpload] = useState(false);
  const [item, setItem] = useState(null);
  const [reference, setReference] = useState("");
  const [references, setReferences] = useState([]);

  useEffect(() => {
    db.doc("Sync/OpenToSubmit").onSnapshot((doc) => {
      if (doc.exists) {
        setReferences(doc.data().OpenToSubmit);
      }
    });
  }, []);
  // gets data from a reference string then turns it into an item
  useEffect(() => {
    console.log("logging from challenges " + reference);
    if (reference === "") {
      console.log("setting upload to false");
      setUpload(false);
    } else {
      console.log("setting upload to true");
      db.doc(reference)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log(doc.data());
            const title = doc.data().Title;
            const collectionPath = doc.data().CollectionPath;
            const cycle = doc.data().Cycle;
            const end = doc.data().End
            const cycleLength = doc.data().CycleLength
            setItem({
              title: title,
              end: end,
              collectionPath: collectionPath,
              cycle: cycle,
              cycleLength :cycleLength
            });
          }
        });
    }
  }, [reference]);

  useEffect(() => {
    if (item !== null) {
      setUpload(true);
    }
  }, [item]);

  return (
    <div>
      <Box style={{ 
        backgroundColor: "black", 
        opacity: window.innerWidth>700?"0%":"35%" }}></Box>
      <Box />
      <TitleBox>
        {upload ? (
          <Upload
            item={item}
            reference={reference}
            setReference={setReference}
            setUpload={setUpload}
            upload={upload}
            setSelected={props.setSelected}
          ></Upload>
        ) : (
          <FadeIn>
            <ChallengeCards
              setUpload={setUpload}
              references={references}
              setReference={setReference}
            ></ChallengeCards>
          </FadeIn>
        )}
      </TitleBox>
    </div>
  );
}
export default Challenges;
