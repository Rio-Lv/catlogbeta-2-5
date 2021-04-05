import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import Grid from "./Grid";

function MyGallery(props) {
  const [references, setReferences] = useState([]);
  useEffect(() => {
    db.collection("users")
      .doc(props.user.uid)
      .onSnapshot((snap) => {
        if (snap.exists) {
          console.log(snap.data());
          setReferences(snap.data().references);

          references.forEach((reference) => {
            var current;
            reference.get().then((doc) => {
              if (doc.exists) {
                //console.log('getting doc from reference list in users')
                console.log(doc.data());
                current = doc.data();
              } else {
                console.log("doc not found");
              }
            });

            console.log(current);
          });
        }
      });
  }, []);
  return (
    <div>
      <Grid references ={references}></Grid>
    </div>
  );
}

export default MyGallery;
