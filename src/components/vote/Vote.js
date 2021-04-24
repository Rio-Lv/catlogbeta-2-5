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
  const [OpenToVote,setOpenToVote] = useState([]);

  useEffect(()=>{
    db.doc("Sync/OpenToVote").onSnapshot((doc) => {
      console.log('docRead')
      setOpenToVote(doc.data().OpenToVote);
    })
  },[])

  const shuffle = () =>{
    db.doc("Sync/OpenToVote").onSnapshot((doc) => {
      console.log('docRead')
      const OpenToVote = doc.data().OpenToVote;
      // console.log("open to vote " + OpenToVote);
      const cycle = OpenToVote[random(OpenToVote.length)];
      setCycle(cycle);

      db.doc(`VotingList/${cycle}`).onSnapshot((doc) => {
        console.log('docRead')
        if (doc.exists) {
          // console.log("data from Voting list cycle :" + cycle);
          // console.log(doc.data().List);
          const listSize = doc.data().List.length;
          // console.log("list size is : " + listSize);
          if (listSize > 0) {
            setDocNameLeft(doc.data().List[random(listSize)]);
            setDocNameRight(doc.data().List[random(listSize)]);
            // console.log(
            //   "setting doc names to the react hooks on Vote component load"
            // );
          } else {
            console.log("list size too small");
          }
        }
      });
    });
  }

  useEffect(() => {
   shuffle();
  }, []);

  //run a function on change to the randomized doc names
  useEffect(() => {
    // console.log("Cycle " + Cycle);
    // console.log("docNameLeft " + docNameLeft);
    // console.log("docNameRight " + docNameRight);
  }, [docNameLeft, docNameRight, Cycle]);

  return (
    <div>

      <VoteBox
        left={docNameLeft!==""?`Submissions/AllSubmissions/${Cycle}/${docNameLeft}`:""}
        right={docNameRight!==""?`Submissions/AllSubmissions/${Cycle}/${docNameRight}`:""}
        shuffle ={shuffle}
      ></VoteBox>
    </div>
  );
}

export default Vote;
