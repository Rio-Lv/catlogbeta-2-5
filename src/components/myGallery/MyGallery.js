import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import Grid from "./Grid";
import styled from "styled-components";

const Title = styled.div`

`
var collator = new Intl.Collator(String, {
  numeric: true,
  sensitivity: "base",
});
function MyGallery(props) {
  const [references, setReferences] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(props.user.uid)
      .onSnapshot((snap) => {
        if (snap.exists) {
          try{

            setReferences(snap.data().references.sort());
  
            references.forEach((reference) => {
              var current;
              reference.get().then((doc) => {
                if (doc.exists) {
                  //console.log('getting doc from reference list in users')
                  console.log(doc.data());
                } else {
                  console.log("doc not found");
                }
              });
  
              console.log(current);
            });
          }catch{
            console.log("empty")
          }
        }
      });
  }, []);
  return (
    <div>
      <Grid references={references.sort(collator.compare)}></Grid>
    </div>
  );
}

export default MyGallery;
