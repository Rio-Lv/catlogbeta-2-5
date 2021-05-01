import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import styled from "styled-components";
import firebase from "firebase";

const cyc = 109;

const Button = styled.button`
  margin: 3px;
  height: 40px;
  font-size: 20px;
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
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const user = firebase.auth().currentUser.uid;
    if (user === "MhfOTaev7FNCommUnKOdtOiYQtZ2") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0";
    }
  }, []);

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
    console.log("updating Current");
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
        const NumActive = doc.data().NumActive;
        const CycleLength = doc.data().CycleLength;
        // const DurationLength = doc.data().DurationLength;
        const StartDate = doc.data().StartDate;
        const CurrentCycle = Math.floor((now - StartDate) / CycleLength) - 0;
        const VoteCompletedCycle = CurrentCycle - 2 * NumActive;
        const SubmitCompletedCycle = CurrentCycle - NumActive;

        const millisPerDay = 1000 * 60 * 60 * 24;
        const millisPerWeek = millisPerDay * 7;
        const CycleStart = CurrentCycle * millisPerDay + StartDate;
        const CycleEnd = CycleStart + millisPerWeek;

        db.collection("Sync")
          .doc("Current")
          .set({
            ReadableIssueTime: date.toDateString(),
            Cycle: CurrentCycle,
            VoteCompletedCycle: VoteCompletedCycle,
            SubmitCompletedCycle: SubmitCompletedCycle,
            Title: random,
            Start: CycleStart,
            End: CycleEnd,
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
      })
      .then(() => {
        console.log("this running after autoGenrateSubmissions has run");
      });
  };

  const fixFreshToVote = () => {
    db.doc("Template/Cats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const CatArray = doc.data().CatArray;

          db.doc("Sync/Current")
            .get()
            .then((current) => {
              const SubmitCompletedCycle = current.data().SubmitCompletedCycle;
              console.log("Submit Completed Cycle: " + SubmitCompletedCycle);
              db.collection(
                `Submissions/AllSubmissions/${SubmitCompletedCycle}`
              )
                .get()
                .then((snap) => {
                  console.log(`cycle ${doc.id} : size ${snap.size}`);
                  if (snap.size < 10) {
                    //========
                    db.collection("Challenges")
                      .doc(`Cycle_${SubmitCompletedCycle}`)
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
                            `Submissions/AllSubmissions/${SubmitCompletedCycle}`
                          )
                            .doc(randomID)
                            .set(
                              {
                                cycle: SubmitCompletedCycle,
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
                  } else {
                    console.log("no need to change, enough submissions");
                  }
                });
            })
            .then(() => {
              console.log("check running after cat loop");
              updateVotingList();
            });
        }
      });
  };

  const GenerateSubmissionsForOne = (cycle) => {
    console.log("GenerateSubmissionsForOne");
    db.doc("Template/Cats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const CatArray = doc.data().CatArray;
          //=======

          db.collection(`Submissions/AllSubmissions/${cycle}`)
            .get()
            .then((snap) => {
              console.log(`cycle ${cycle} : size ${snap.size}`);
              if (snap.size < 10 || snap.size === undefined) {
                //========
                db.collection("Challenges")
                  .doc(`Cycle_${cycle}`)
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
                      db.collection(`Submissions/AllSubmissions/${cycle}`)
                        .doc(randomID)
                        .set(
                          {
                            cycle: cycle,
                            displayName: randomID,
                            losses: 1,
                            title: title,
                            url: url,
                            urlSmall: url,
                            user: randomID,
                            winrate: 0.5,
                            wins: 1,
                          },
                          { merge: true }
                        );
                    });
                  });
              }
            });
        }
      });
  };

  const calculateWinrate = () => {
    db.doc("Sync/Current")
      .get()
      .then((current) => {
        const completedCycle = current.data().CompletedCycle;

        db.collection(`/Submissions/AllSubmissions/${completedCycle}`)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              //doc.data() is never undefined for query doc snapshots
              const docRef = db.doc(
                `/Submissions/AllSubmissions/${completedCycle}/${
                  doc.data().user
                }`
              );
              docRef.get().then((submission) => {
                const wins = submission.data().wins;
                const losses = submission.data().losses;
                const winrate = wins / (wins + losses) || 0.5;
                console.log(winrate);
                docRef.set(
                  {
                    winrate: winrate,
                  },
                  { merge: true }
                );
              });
            });
          });
      });
  };
  const tempCreateSubmission103 = () => {};
  const OpenToGallery = () => {
    db.doc("Sync/Constants")
      .get()
      .then((constants) => {
        const NumActive = constants.data().NumActive;
      });
  };

  const updateOpenToFame = () => {
    console.log("updating Open to Fame");
    db.collection("Winners")
      .get()
      .then((snap) => {
        const cycles = [];
        snap.forEach((doc) => {
          console.log(doc.id);
          cycles.push(doc.id);
        });
        db.doc("Sync/OpenToFame").set({
          OpenToFame: cycles,
        });
      });
  };

  const exploreSubmissions = () => {
    db.doc("Submissions/AllSubmissions")
      .get()
      .then((doc) => {
        console.log(doc.data());
      });
  };
  // dangerous function, dont use again until sure
  const cleanUpChallenges = () => {
    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        const NumActive = doc.data().NumActive;
        db.doc("Sync/Current")
          .get()
          .then((current) => {
            const CurrentCycle = current.data().Cycle;
            const NewestCompletedCycle = CurrentCycle - 2 * NumActive;
            console.log(NewestCompletedCycle);
            db.collection("Challenges")
              .get()
              .then((challenges) => {
                challenges.forEach((challenge) => {
                  // removing older testing challenges, especially the empty ones, fore now, also the ones with less then 10, new ones have auto generated cats
                  if (
                    (challenge.data().CollectionSize < 10 ||
                      challenge.data().CollectionSize === undefined) &&
                    challenge.data().Cycle <= NewestCompletedCycle
                  ) {
                    console.log(challenge.id);
                    // db.doc(`Challenges/${challenge.id}`).delete()
                  }
                });
              });
          });
      });
  };
  const sortWinner = () => {
    console.log("sorting Winner");
    db.doc("Sync/Current")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const VoteCompletedCycle = doc.data().VoteCompletedCycle;
          const collectionRef = db.collection(
            `Submissions/AllSubmissions/${VoteCompletedCycle}`
          );
          console.log(VoteCompletedCycle);
          collectionRef.get().then((snap) => {
            console.log(snap.size);

            snap.forEach((submission) => {
              const id = submission.data().user;
              const wins = submission.data().wins;
              const losses = submission.data().losses;
              const winrate = wins / (wins + losses) || 0.5;
              console.log("winrate: " + winrate);
              const docRef = db.doc(
                `Submissions/AllSubmissions/${VoteCompletedCycle}/${id}`
              );
              docRef.set(
                {
                  winrate: winrate,
                },
                { merge: true }
              );
            });
            const WinnersPerCycle = 3;
            collectionRef
              .orderBy("winrate", "desc")
              .limit(WinnersPerCycle)
              .get()
              .then((snap) => {
                const winners = [];
                snap.forEach((item) => {
                  const winnerRef = `Submissions/AllSubmissions/${VoteCompletedCycle}/${item.id}`;
                  db.doc(winnerRef)
                    .get()
                    .then((doc) => {
                      if (doc.exists) {
                        console.log(
                          winnerRef + " from winners array in sort winners "
                        );
                        // make doc exist first to avoid query invis
                        db.doc(`Winners/${VoteCompletedCycle}`)
                          .set({
                            hi: "hello",
                          },{merge:true})
                          .then(() => {
                            db.doc(
                              `Winners/${VoteCompletedCycle}/top3/${item.id}`
                            ).set(doc.data());
                          });
                      }
                    });
                });

                winners.forEach((ref) => {});
              });
          });
        } else {
          console.log("doc not found");
        }
      });
  };

  const indexCollection = () => {
    db.collection("Winners/103/top3")
      .get()
      .then((snap) => {
        // const references = [];

        snap.forEach((doc) => {
          console.log(doc.data());
        });
      });
  };

  const indexWinners = () => {
    console.log("indexing the winners");
    // get collection of cycles that have winners
    db.collection("Winners")
      .get()
      .then((winners) => {
        // winners is a collection
        winners.forEach((cycle) => {
          // each cycle is a document with a collection called top 3
          db.collection(`Winners/${cycle.id}/top3`)
            .get()
            .then((top3) => {
              // top3 is a collection with 3 document duplicates
              const top3paths = []; // this array will be set as a document in with a cycle id in WinnerList collection
              top3.forEach((doc) => {
                // push path reference to the duplicates
                top3paths.push(`Winners/${cycle.id}/top3/${doc.id}`);
              });
              // pushing the array to the winner list
              db.doc(`Winners/${cycle.id}`).set(
                {
                  top3paths: top3paths,
                },
                { merge: true }
              );
            });
        });
      });
  };

  const resetTime = () => {
    const timeFunc = (cycle) => {
      const StartDate = 1609459200000;
      const millisPerDay = 1000 * 60 * 60 * 24;
      const millisPerWeek = millisPerDay * 7;
      const CycleStart = cycle * millisPerDay + StartDate;
      const CycleEnd = CycleStart + millisPerWeek;

      // console.log("cycleStart: " + CycleStart)
      // console.log("cyleEnd: "+ CycleEnd)
      return { CycleStart, CycleEnd };
    };
    db.collection("Challenges")
      .get()
      .then((challenges) => {
        challenges.forEach((challenge) => {
          const cycle = challenge.data().Cycle;
          console.log(cycle);
          const cycleStart = timeFunc(cycle).CycleStart;
          const cycleEnd = timeFunc(cycle).CycleEnd;
          console.log("cycleStart: " + cycleStart);
          console.log("cyleEnd: " + cycleEnd);
          db.doc(`Challenges/Cycle_${cycle}`).set(
            {
              Start: cycleStart,
              End: cycleEnd,
            },
            { merge: true }
          );
        });
      });
  };

  return (
    <div>
      {isAdmin ? (
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
          <Button onClick={resetTime}>reset Time</Button>
          <Button onClick={indexWinners}>Index Winners</Button>
          <Button onClick={indexCollection}>Index Collection</Button>
          <Button onClick={fixFreshToVote}>fixFreshToVote</Button>
          <Button onClick={sortWinner}>sort Winner</Button>
          <Button onClick={updateOpenToFame}>updateOpenToFame</Button>
          <Button
            onClick={() => {
              GenerateSubmissionsForOne(103);
            }}
          >
            GenerateSubmissionsForOne
          </Button>
          <Button onClick={updateCurrent}>updateCurrent</Button>
          <Button onClick={cleanUpChallenges}>clean up challenges</Button>
          <Button onClick={exploreSubmissions}>explore Submissions</Button>
          <Button
            onClick={() => {
              calculateWinrate(106);
            }}
          >
            calculateWinrate
          </Button>
          <Button onClick={autoGenerateSubmissions}>
            autoGenerateSubmissions
          </Button>
          <Button onClick={uploadTemplateCats}>uploadTemplateCats</Button>
          <Button onClick={updateVotingList}>update Voting List</Button>
          <Button onClick={updateOpenToVote}>Update OpenToVote</Button>
          <Button>Update Challenges</Button>
          <Button onClick={updateChallengesCycleLength}>
            updateChallengesCycleLength
          </Button>
        </div>
      ) : null}

      <div style={{ width: "150px", textAlign: "center" }}>
        <h1 style={{ color: "black" }}>Admin</h1>
      </div>
    </div>
  );
}

export default Admin;
