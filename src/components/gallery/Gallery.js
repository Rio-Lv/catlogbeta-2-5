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
        const CurrentCycle = Math.floor((now - StartDate) / CycleLength) - 0;

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
            Cycle: doc.data().Cycle,
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
              OpenToVote.push(`${Cycle - i - NumActive}`);
            }
            console.log(OpenToVote);
            db.collection("Sync")
              .doc("OpenToVote")
              .set({ OpenToVote: OpenToVote });
          });
      });
  };
  const updateChallengesCycleLength = () => {
    db.collection("Sync")
      .doc("OpenToVote")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const OpenToVote = doc.data().OpenToVote;
          console.log(OpenToVote);
          OpenToVote.forEach((challengePath) => {
            console.log(challengePath);
            db.doc(challengePath)
              .get()
              .then((doc) => {
                const cycle = doc.data().Cycle;
                console.log(cycle);
                db.collection(`Submissions/AllSubmissions/${cycle}/`)
                  .get()
                  .then((snap) => {
                    console.log(snap.size);

                    db.doc(`Challenges/Cycle_${cycle}`).set(
                      {
                        CollectionSize: snap.size || 0,
                      },
                      { merge: true }
                    );
                  });
              });
          });
        }
      });
  };

  const fixChallenge = (cycle) => {
    const random = randomPictionaryWords({
      exactly: 2,
      wordsPerString: 1,
      join: " ",
    });
    db.doc(`Challenges/Cycle_${cycle}`).set({
      Cycle: cycle,
      Title: random,
      End: 1617908395421,
      Start: 1617821995421,
      ReadableIssueTime: "Wed Apr 07 2021",
      CycleLength: 86400000,
    });
  };

  const updateVotingList = () => {
    console.log("running update Voting list");
    db.doc("Sync/OpenToVote")
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log(doc.data().OpenToVote)
          //clear old
          db.collection("VotingList").onSnapshot((snapshot)=>{
            console.log(doc.data().OpenToVote)
            snapshot.forEach(cycle=>{
              console.log(cycle.id)
              if(doc.data().OpenToVote.includes(cycle.id)){
                console.log("Open to Vote")
              }else{
                console.log("expired submission, now deleting from Voting List")
                db.doc(`VotingList/${cycle.id}`).delete()
              }
            })
          })
          

          doc.data().OpenToVote.forEach((Cycle) => {
            db.doc(`Challenges/Cycle_${Cycle}`)
              .get()
              .then((doc) => {
                const cycle = doc.data().Cycle;

                db.collection(`/Submissions/AllSubmissions/${cycle}`)
                  .get()
                  .then((collection) => {
                    const array = [];
                    collection.forEach((doc) => {
                      array.push(doc.id);
                    });
                    db.doc(`VotingList/${cycle}`).set(
                      {
                        List: array,
                      },
                      { merge: true }
                    );
                  });
              });
          });
        }
      });
  };

  return (
    <div>
      <button
        style={{ position: "fixed", left: "30%" }}
        onClick={() => {
          updateVotingList();
        }}
      >
        update Voting List
      </button>
      <button
        style={{ position: "fixed", left: "50%" }}
        onClick={updateOpenToVote}
      >
        Update OpenToVote
      </button>
      <button
        style={{ position: "fixed", left: "80%" }}
        onClick={updateChallenges}
      >
        Update Challenges
      </button>
      <button
        style={{ position: "fixed", left: "70%" }}
        onClick={()=>{
           updateChallengesCycleLength();

          fixChallenge(94)}}
      >
        fix Challenge
      </button>
      Gallery
    </div>
  );
}

export default Gallery;
