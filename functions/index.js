const functions = require("firebase-functions");
const admin = require("firebase-admin");
var randomPictionaryWords = require("word-pictionary-list");
admin.initializeApp();
const db = admin.firestore();

exports.setCurrent = functions.pubsub
  .schedule("every 1440 minutes")
  .onRun((context) => {
    console.log("updating Current");
    const random = randomPictionaryWords({
      exactly: 2,
      wordsPerString: 1,
      join: " ",
    });
    console.log(random);
    const now = Date.now();
    var date = new Date();

    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const CycleLength = doc.data().CycleLength;
          const DurationLength = doc.data().DurationLength;
          const StartDate = doc.data().StartDate;
          const CurrentCycle = Math.floor((now - StartDate) / CycleLength) + 1;

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
        } else {
          console.log("doc does not exist");
        }
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

exports.updateChallengesCycleLength = functions.firestore
  .document("Sync/Current")
  .onUpdate((change, context) => {
    // getting Open to vote doc, only these collection should have changing sizes
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
  });

exports.updateVotingList = functions.firestore
  .document("Sync/OpenToVote")
  .onWrite((change, context) => {
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
  });

exports.autoGenerateSubmissions = functions.firestore
  .document("Sync/OpenToVote")
  .onWrite((change, context) => {
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
              });
            });
        }
      });
  });

exports.updateOpenToSort = functions.firestore
  .document("Sync/Current")
  .onWrite((change, context) => {
    console.log("updating Open to Sort");
    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        db.doc("Sync/Current")
          .get()
          .then((current) => {
            const CompletedCycle = current.data().CompletedCycle;

            db.doc("Sync/OpenToSort")
              .get()
              .then((document) => {
                if (document.exists) {
                  const OpenToSort = document.data().OpenToSort || [];
                  if (!OpenToSort.includes(CompletedCycle)) {
                    db.collection("Sync")
                      .doc("OpenToSort")
                      .set({
                        OpenToSort: [...OpenToSort, CompletedCycle],
                      });
                  } else {
                    console.log("already included");
                  }
                } else {
                  db.collection("Sync")
                    .doc("OpenToSort")
                    .set({ OpenToSort: [CompletedCycle] });
                }
              });
          });
      });
  });
