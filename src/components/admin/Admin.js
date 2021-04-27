import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";

const cyc = 109;

const Button = styled.button`
  margin: 5px;
  height: 50px;
  font-size: 30px;
  color: white;
  border: 3px solid black;
  background-color: black;
  border-radius: 5px;
  &:hover {
    color: blue;
  }
`;
var randomPictionaryWords = require("word-pictionary-list");

function Admin(props) {
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
          OpenToVote.forEach((cycle) => {
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
          doc.data().OpenToVote.forEach((Cycle) => {
            db.doc(`Challenges/Cycle_${Cycle}`)
              .get()
              .then((challenge) => {
                const cycle = challenge.data().Cycle;

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
                    db.collection("VotingList")
                      .get()
                      .then((snapshot) => {
                        console.log(doc.data().OpenToVote);
                        snapshot.forEach((cycle) => {
                          console.log(cycle.id);
                          if (doc.data().OpenToVote.includes(cycle.id)) {
                            console.log("Open to Vote");
                          } else {
                            console.log(
                              "expired submission, now deleting from Voting List"
                            );
                            db.doc(`VotingList/${cycle.id}`).delete();
                          }
                        });
                      });
                  });
              });
          });
        }
      });
  };

  const createSubmissions = (docID, cycle) => {
    const url =
      "https://lh3.googleusercontent.com/proxy/O1UDmcofZeNcKChJSscmbrWDtERatnkMCA3Crg7dkVRNG540jIR6mYnepKzBrDV5M-HXuhc8ktJYRWsWSSg-a5cQO2f3YzSvnkGjPXtszm06DtmF_jfIs8LQ-2E4qLaQ=w1200-h630-p-k-no-nu";

    db.doc(`Submissions/AllSubmissions/${cycle}/${docID}`).set({
      cycle: cycle,
      displayName: "TestName",
      losses: 0,
      timeleft: 0,
      title: "TestTitle",
      url: url,
      urlSmall: url,
      user: docID,
      winrate: 0.5,
      wins: 0,
    });
    db.doc(`VotingList/${cycle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const array = [...doc.data().List, docID];
          db.doc(`VotingList/${cycle}`).set({ List: array });
        }
      });
  };

  const uploadTemplateCats = () => {
    console.log("uploading template cats");
    const CatArray = [
      "https://editdit-assets.s3.amazonaws.com/image/Smiling-Cat.png",
      "https://i.pinimg.com/originals/5c/a1/42/5ca142d34fd1903773b4f4e6f43d9045.jpg",
      "https://i.redd.it/7k24xova0ya11.jpg",
      "https://pbs.twimg.com/media/EkMUUhSUcAApA1K.jpg",
      "https://i.ytimg.com/vi/ATd93kekvGw/hqdefault.jpg",
      "https://i1.wp.com/comicsandmemes.com/wp-content/uploads/blank-meme-template-108-cursed-cat.jpg?resize=569%2C599&ssl=1",
      "https://pbs.twimg.com/profile_images/1165050082976260096/WBeTNxCn_400x400.jpg",
      "https://i.pinimg.com/originals/8e/c0/79/8ec079914ed107c1378fdbb0525151ec.jpg",
      "https://i.ytimg.com/vi/317jz-PU7Mg/maxresdefault.jpg",
      "https://image.slidesharecdn.com/funnycatvideosdownload-150901043709-lva1-app6892/95/funny-cat-videos-download-1-638.jpg?cb=1441082273",
      "https://ruinmyweek.com/wp-content/uploads/2016/05/the-best-funny-pictures-of-awkward-cat-photoshop-battles-long-legs-1.jpg",
    ];
    db.collection("Template").doc("Cats").set(
      {
        CatArray: CatArray,
      },
      { merge: true }
    );
  };

  const autoGenerateSubmissions = () => {
    db.doc("Template/Cats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const CatArray = doc.data().CatArray;
          //=======
          db.collection("VotingList")
            .get()
            .then((collection) => {
              collection.forEach((doc) => {
                db.collection(`Submissions/AllSubmissions/${doc.id}`)
                  .get()
                  .then((snap) => {
                    console.log(`cycle ${doc.id} : size ${snap.size}`);
                    if (snap.size < 10) {
                      //========
                      db.collection("Challenges")
                        .doc(`Cycle_${doc.id}`)
                        .get()
                        .then((challenge) => {
                          const title = challenge.data().Title;

                          CatArray.forEach((url) => {
                            const randomID = `TemplateID_${Math.floor(
                              Math.random() * 1000
                            )}`;

                            console.log(randomID);
                            console.log("adding these to submissions ");
                            //=====
                            db.collection(
                              `Submissions/AllSubmissions/${doc.id}`
                            )
                              .doc(randomID)
                              .set(
                                {
                                  cycle: doc.id,
                                  displayName: randomID,
                                  losses: 0,
                                  title: title,
                                  url: url,
                                  urlSmall: url,
                                  user: randomID,
                                  winrate: 0.5,
                                  wins: 0,
                                },
                                { merge: true }
                              );
                          });
                        });
                    }
                  });
              });
            });
        }
      });
  };

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <Button onClick={autoGenerateSubmissions}>autoGenerateSubmissions</Button>
      <Button onClick={uploadTemplateCats}>uploadTemplateCats</Button>
      <Button onClick={updateVotingList}>update Voting List</Button>
      <Button>Update OpenToVote</Button>
      <Button>Update Challenges</Button>
      <Button onClick={updateChallengesCycleLength}>
        updateChallengesCycleLength
      </Button>
      <Button
        onClick={() => {
          createSubmissions(
            `test_id_${Math.floor(Math.random() * 10000)}`,
            cyc
          );
          console.log(`creating test sumbission for Cycle ${cyc}`);
        }}
      >
        create submission {cyc}
      </Button>

      <div style={{ width: "150px", textAlign: "center" }}>
        <h1 style={{ color: "black" }}>Admin</h1>
      </div>
    </div>
  );
}

export default Admin;
