import { db, storage } from "../../../firebase";

const smoothIso = (X, Y, W) => {
  const D = Math.abs(X - Y);
  const invD = (1 / D) * W;
  // console.log(`invD === ${invD}`)
  const sigmoid = 1 / (1 + Math.pow(2.718, -invD));
  const result = (sigmoid - 0.5) * 2;
  // console.log("testing out smoothIso result == "  + result)
  return result;
};
const getRGB = (item) => {
  // comes in percentage of week left eg. 0.1 = 10%
  const T = item.timeleft;
  // const R = 255 * (1 - T);
  // const G = 255 * T;
  // const B = 255 * (1 - Math.abs(0.5 - T));
  const G = 255 * smoothIso(1, T, 0.5);
  const B = 255 * smoothIso(0.5, T, 0.2);
  const R = 255 * smoothIso(0, T, 0.5);
  //   console.log({ T, R, G, B });
  return { R, G, B };
};
const getTimeRemaining = (item) => {
  const timePercent = item.timeleft; //in percent of a cycle
  const seconds = timePercent * 604800; // seconds in a week
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  if (days >= 1) {
    const D = Math.floor(days);
    const H = Math.floor(hours - D * 24);
    return {
      short: Math.round(days) + "D",
      verbose: D + " Days, " + H + " hours",
    };
  }
  if (days < 1 && hours >= 1) {
    const H = Math.floor(hours);
    const M = minutes - H * 60;
    return {
      short: Math.round(hours) + "H",
      verbose: H + "H, " + M + " minutes",
    };
  }
  if (hours < 1) {
    return {
      short: Math.round(minutes) + "M",
      verbose: Math.floor(minutes) + " minutes",
    };
  }
};
const makeSubmission = (user, url, cycle, title) => {
  const submission = {
    user: user.uid,
    displayName: user.displayName,
    cycle: cycle,
    title: title,
    url: url,
    wins: 0,
    losses: 0,
    winrate: 0.5,
  };
  return submission;
};
const submissionId = (cycle, user) => {
  return `Cycle${cycle}-From-User-${user.uid}`;
};
const referenceId = (cycle) => {
  return `Cycle${cycle}`;
};
const handleUpload = (image, user, cycle, title, setImage) => {
  if (image !== null) {
    console.log("from handle upload in Challenges Sub functions");
    console.log(user.uid);
    // t.ref.storage
    //   .delete()
    //   .then(() => {
    //     console.log("successfully deleted, ready for replacement");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // storing the image
    storage
      .ref(`submissions/${submissionId(cycle, user)}`)
      .put(image)
      .then(() => {
        storage
          .ref(`submissions/${submissionId(cycle, user)}`)
          .getDownloadURL()
          .then((url) => {
            const submission = makeSubmission(user, url, cycle, title);
            // send to all submissions
            console.log("sending to submissions");
            db.collection("submissions")
              .doc(submissionId(cycle, user))
              .set(submission, (error) => {
                console.log(error);
              });
            console.log("sending to users");

            const reference = db
              .collection("submissions")
              .doc(submissionId(cycle, user));
            // send refence to users

            //get references from user account
            db.collection("users")
              .doc(user.uid)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  const newReferences = doc.data().references;
                  console.log(reference)

                  const p = new Promise((resolve, reject) => {
                    let refStrings = newReferences.map((ref)=>{
                      return ref.path
                    })
                    console.log(refStrings)
                    const exists = refStrings.includes(reference.path);
                    console.log(newReferences[0].path);
                    if (exists) {
                      resolve("refence already exists");
                    } else {
                      reject("does not exist");
                    }
                  });

                  p.then((msg) => {
                    console.log(msg);
                    db.collection("users")
                      .doc(user.uid)
                      .set({ references: newReferences });
                  }).catch((msg) => {
                    console.log(msg);
                    db.collection("users")
                      .doc(user.uid)
                      .set({ references: [...newReferences, reference] });
                  });
                } else {
                  console.log("setting new doc");
                  db.collection("users")
                    .doc(user.uid)
                    .set({ references: [reference] });
                }
              });
            // clear the image that is in the react hook Image
            setImage(null);
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            console.log("error from challenges sub functions");
            console.log(error);
          });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("succeesss");
        }
      });
  } else {
    alert("no image loaded or image is not acceptable");
  }
};

export { getRGB, getTimeRemaining, handleUpload,referenceId };
