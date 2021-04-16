import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
var randomPictionaryWords = require("word-pictionary-list");

function Gallery(props) {
  useEffect(() => {
    db.collection("Winners")
      .doc("References")
      .onSnapshot((snap) => {
        if (snap.exists) {
          // console.log(snap.data());
        }
      });
  }, []);

  const updateCurrent = () => {
    // console.log("updating Constants");
    const random = randomPictionaryWords({
      exactly: 2,
      wordsPerString: 1,
      join: " ",
    });
    // console.log(random);
    const now = Date.now();
    var date = new Date();

    db.doc("Sync/Constants")
      .get()
      .then((doc) => {
        const CycleLength = doc.data().CycleLength;
        const DurationLength = doc.data().DurationLength;
        const StartDate = doc.data().StartDate;
        const CurrentCycle = Math.floor((now - StartDate) / CycleLength)-0;

        db.collection("Sync")
          .doc("Current")
          .set({
            ReadableIssueTime: date.toDateString(),
            Cycle: CurrentCycle,
            Title: random,
            Start: now,
            End: now + DurationLength,

            CollectionPath: `/Submissions/AllSubmissions/Cycle_${CurrentCycle}`,
          });
      });
  };

  const updateChallenges = () => {
    // console.log("updating Challenges");
    db.collection("Sync")
      .doc("Current")
      .get()
      .then((doc) => {
        db.collection("Challenges")
          .doc(`Cycle_${doc.data().Cycle}`)
          .set({
            Title: doc.data().Title,
            Start: doc.data().Start,
            End: doc.data().End,
            Cycle:doc.data().Cycle,
            CycleLength: doc.data().End - doc.data().Start,
            ReadableIssueTime: doc.data().ReadableIssueTime,
            CollectionPath: doc.data().CollectionPath,
          });
      });
  };

  const updateOpenToSubmit = () => {
    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        const NumActive = doc.data().NumActive;

        db.collection("Sync")
          .doc("Current")
          .get()
          .then((doc) => {
            const Cycle = doc.data().Cycle;
            const OpenToSubmit = [];
            for (let i = 0; i < NumActive; i++) {
              OpenToSubmit.push(`Challenges/Cycle_${Cycle - i}`);
            }
            // console.log(OpenToSubmit);
            db.collection("Sync")
              .doc("OpenToSubmit")
              .set({ OpenToSubmit: OpenToSubmit });
          });
      });

      
  };
  const updateOpenToVote = () => {
    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        const NumActive = doc.data().NumActive;

        db.collection("Sync")
          .doc("Current")
          .get()
          .then((doc) => {
            const Cycle = doc.data().Cycle;
            const OpenToVote = [];
            for (let i = 0; i < NumActive; i++) {
              OpenToVote.push(`Challenges/Cycle_${Cycle - i-NumActive}`);
            }
            console.log(OpenToVote);
            db.collection("Sync")
              .doc("OpenToVote")
              .set({ OpenToVote: OpenToVote });
          });
      });
    };
  return (
    <div>
      <button
        style={{ position: "fixed", left: "30%" }}
        onClick={updateCurrent}
      >
        Update Current
      </button>
      <button style={{ position: "fixed", left: "50%" }} onClick={updateOpenToVote}>
        Update OpenToVote
      </button>
      <button style={{ position: "fixed", left: "80%" }} onClick={updateChallenges}>
        Update Challenges
      </button>
      Gallery
    </div>
  );
}

export default Gallery;
