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

const handleUpload = (image, smallImage, user, item, setImage) => {
  // connected to Submit card but image is propped from Upload.js
  if (image !== null) {
    console.log("from handle upload in Challenges Sub functions");
    console.log(user.uid);
    storage
      .ref(`submissions/${item.cycle}/${user.uid}`)
      .put(image)
      .then(() => {
        storage
          .ref(`submissionsSmall/${item.cycle}/${user.uid}`)
          .put(smallImage)
          .then(() => {
            storage
              .ref(`submissions/${item.cycle}/${user.uid}`)
              .getDownloadURL()
              .then((url) => {
                storage
                  .ref(`submissionsSmall/${item.cycle}/${user.uid}`)
                  .getDownloadURL()
                  .then((urlSmall) => {
                    const submission = {
                      user: user.uid,
                      displayName: user.displayName,
                      cycle: item.cycle,
                      title: item.title,
                      timeleft: item.timeleft,
                      url: url,
                      urlSmall: urlSmall,
                      wins: 0,
                      losses: 0,
                      winrate: 0.5,
                    };
                    // send to cycle submissions - user
                    console.log(
                      `sending to submission to Submissions/AllSubmissions/${item.cycle}`
                    );
                    db.collection(`Submissions/AllSubmissions/${item.cycle}`)
                      .doc(user.uid)
                      .set(submission, (error) => {
                        console.log(error);
                      });
                    console.log("sending to users");

                    const reference = `Submissions/AllSubmissions/${item.cycle}/${user.uid}`
                     
                    // send refence to users

                    //get references from user account
                    db.collection("users")
                      .doc(user.uid)
                      .get()
                      .then((doc) => {
                        if (doc.exists) {
                          const references = doc.data().references;
                          console.log(references);
                          if(references.includes(reference)){
                            console.log('reference already exists')
                          }else{
                            db.collection("users")
                            .doc(user.uid)
                            .set({ references: [...references,reference] });
                          }
                          
                          
                        } else {
                          console.log("setting new doc");
                          db.collection("users")
                            .doc(user.uid)
                            .set({ references: [reference] });
                        }
                      });
                    // clear the image that is in the react hook Image
                  });
                setImage(null);
              })
              .catch((error) => {
                // Uh-oh, an error occurred!
                console.log("error from challenges sub functions");
                console.log(error);
              });
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

// const storeImage = (image, StoragePath) => {
//   storage
//     .ref(StoragePath)
//     .put(image)
//     .then(() => {
//       storage
//         .ref(StoragePath)
//         .getDownloadURL()
//         .then((url) => {})
//         .catch((error) => {
//           // Uh-oh, an error occurred!
//           console.log("error from challenges sub functions");
//           console.log(error);
//         });
//     });
// };



export { getRGB, getTimeRemaining, handleUpload };
