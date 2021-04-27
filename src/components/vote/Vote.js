import React, { useState, useEffect } from "react";
import VoteBox from "./VoteBox";
import { db } from "../../firebase";
const random = (num) => {
  return Math.floor(Math.random() * num);
};

function Vote() {
  const [Cycle, setCycle] = useState(null);
  const [docNameLeft, setDocNameLeft] = useState("");
  const [docNameRight, setDocNameRight] = useState("");
  const [leftItem, setLeftItem] = useState(null);
  const [rightItem, setRightItem] = useState(null);
  const [OpenToVote, setOpenToVote] = useState(null);
  const [docReads, setDocReads] = useState(0);


  const increaseDocRead = () => {
    setDocReads(docReads + 1);
  };

  useEffect(() => {
    db.doc("Sync/OpenToVote").onSnapshot((doc) => {
      increaseDocRead();
      // console.log(doc.data().OpenToVote);
      setOpenToVote(doc.data().OpenToVote);
    });
  }, []);

  const shuffle = () => {
    // console.log("open to vote " + OpenToVote);
    console.log("shuffling")
    if (OpenToVote !== null) {
      console.log("shuffling")
      var cycle = OpenToVote[random(OpenToVote.length)];
      // console.log(cycle)
      if(cycle===Cycle){
        cycle = OpenToVote[random(OpenToVote.length)]
      }
      setCycle(cycle);

      db.doc(`VotingList/${cycle}`).onSnapshot((doc) => {
        // console.log("docRead");
        increaseDocRead();
        if (doc.exists) {
          // console.log("data from Voting list cycle :" + cycle);
          // console.log(doc.data().List);
          const listSize = doc.data().List.length;
          // console.log("list size is : " + listSize);
          if (listSize > 1) {
            const random1 = random(listSize)
            var random2 = random(listSize)
            while(random1===random2){
              random2 =random(listSize)
            }
            if(random1!==random2){
              setDocNameLeft(doc.data().List[random1]);
              setDocNameRight(doc.data().List[random2]);
            }

          } else {
            console.log("list size too small");
            cycle = OpenToVote[random(OpenToVote.length)]
          }
        }
      });
    }
  };

  useEffect(() => {
    // console.log(OpenToVote);
    shuffle();
  }, [OpenToVote]);

  return (
    <div>
      <VoteBox
        LeftPath={
          docNameLeft !== ""
            ? `Submissions/AllSubmissions/${Cycle}/${docNameLeft}`
            : ""
        }
        RightPath={
          docNameRight !== ""
            ? `Submissions/AllSubmissions/${Cycle}/${docNameRight}`
            : ""
        }
        shuffle={shuffle}
        increaseDocRead = {increaseDocRead}
      ></VoteBox>
    </div>
  );
}

export default Vote;
