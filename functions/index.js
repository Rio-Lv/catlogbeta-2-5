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
    var date = new Date()

    db.collection("Sync")
      .doc("Constants")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const CycleLength = doc.data().CycleLength;
          const StartDate = doc.data().StartDate;
          const CurrentCycle = Math.floor((now - StartDate) / CycleLength)+1;

          db.collection("Sync")
            .doc("Current")
            .set({
              ReadableIssueTime:date.toDateString(),
              Cycle: CurrentCycle,
              Title: random,
              Start: now,
              End: now + CycleLength,
              CollectionPath:`/Submissions/AllSubmissions/Cycle_${CurrentCycle}`
            });
        } else {
          console.log("doc does not exist");
        }
      });
  });

// Listen for any change on document `Sync/Constants` in collection `users`
exports.updateChallenges = functions.firestore
  .document("Sync/Current")
  .onUpdate((change, context) => {
    console.log("updating Challenges");

    db.collection("Challenges").doc(`Cycle_${change.after.data().Cycle}`).set({
      Title: change.after.data().Title,
      Start: change.after.data().Start,
      End: change.after.data().End,
      CycleLength:change.after.data().End-change.after.data().Start,
      ReadableIssueTime: change.after.data().ReadableIssueTime,
      CollectionPath:change.after.data().CollectionPath
    });
  });
