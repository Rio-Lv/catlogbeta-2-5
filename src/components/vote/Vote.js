import { ContactlessOutlined } from "@material-ui/icons";
import React, { useState, useEffect } from "react";

import { db } from "../../firebase";

function Vote() {
  const [voteCycles, setVoteCycles] = useState([]);
  const [random, setRandom] = useState(0);

  // get the cycles that are in the voting loop currently
  // voteCycles array looks like [102,103,104,... etc]
  useEffect(() => {
    db.collection("Sync")
      .doc("OpenToVote")
      .onSnapshot((doc) => {
        if (doc.exists) {
          const challengesPaths = doc.data().OpenToVote;
          // console.log(challengesPaths);
          const random = () => {
            return Math.floor(Math.random() * challengesPaths.length);
          };

          db.doc(challengesPaths[random()])
            .get()
            .then((doc) => {
              // console.log(doc.data().Cycle);
              const randomCollection = db.collection(
                `Submissions/AllSubmissions/${doc.data().Cycle}`
              );
              randomCollection.onSnapshot((snap) => {
                // get the collection and then randomize it
               snap.forEach(doc=>{
                 console.log(doc.id)
               })
                
               
                // snap.forEach((doc) => {
                //   console.log(doc.data());
                // });
              });
            });
        }
      });
  }, [random]);

  useEffect(() => {}, [voteCycles]);
  return (
    <div>
      <h1>Vote</h1>
      <button
        style={{ position: "fixed" }}
        onClick={() => {
          console.log(voteCycles);
        }}
      >
        dsafdasfdsf
      </button>
    </div>
  );
}

export default Vote;
