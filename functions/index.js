const functions = require("firebase-functions");
const admin = require("firebase-admin");
var randomPictionaryWords = require("word-pictionary-list");
admin.initializeApp();
const db = admin.firestore();

exports.setCurrent = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("Africa/Abidjan")
  .onRun((context) => {
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
  });
exports.updateChallenges = functions.firestore
  .document("Sync/Current")
  .onUpdate((change, context) => {
    // Listen for any change on document `Sync/Constants` in collection `users`
    // when a new current is created, updates the challenges by adding that creating a doc
    db.collection("Challenges")
      .doc(`Cycle_${change.after.data().Cycle}`)
      .set({
        Title: change.after.data().Title,
        Start: change.after.data().Start,
        End: change.after.data().End,
        Cycle: change.after.data().Cycle,
        CycleLength: change.after.data().End - change.after.data().Start,
        ReadableIssueTime: change.after.data().ReadableIssueTime,
        CollectionPath: change.after.data().CollectionPath,
      });
  });
exports.updateOpenToSubmit = functions.firestore
  .document("Sync/Current")
  .onUpdate((change, context) => {
    console.log("updating Challenges");

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
            console.log(OpenToSubmit);
            db.collection("Sync")
              .doc("OpenToSubmit")
              .set({ OpenToSubmit: OpenToSubmit });
          });
      });
  });
exports.updateOpenToVote = functions.firestore
  .document("Sync/Current")
  .onUpdate((change, context) => {
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
  });
// running this after Submissions have been generated
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
exports.fixFreshToVote = functions.firestore
  .document("Sync/Current")
  .onWrite((change, context) => {
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
  });
exports.sortWinner = functions.firestore
  .document("Sync/Current")
  .onWrite((change, context) => {
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
                          .set(
                            {
                              hi: "hello",
                            },
                            { merge: true }
                          )
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
  });
exports.updateOpenToFame = functions.firestore
  .document("Winners/{Cycle}")
  .onWrite((change, context) => {
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
  });
exports.indexWinners = functions.firestore
  .document("Winners/{Cycle}")
  .onWrite((change, context) => {
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
  });
