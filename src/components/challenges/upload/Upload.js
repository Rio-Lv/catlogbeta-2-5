import React, { useState, useEffect } from "react";
// import styled from "styled-components";
import FadeIn from "react-fade-in";
// import { getRGB, handleUpload } from "./upload/functions";
import TitleCard from "./TitleCard";
import UploadCard from "./UploadCard";
import SubmitCard from "./SubmitCard";

import firebase from "firebase";
// using for resizing to 1:1 ratio

// props from challenges
//takes
// item={item}
// reference={reference}
// setReference={setReference}
// setUpload={setUpload}
// upload={upload}
// setSelected={props.setSelected}
function Upload(props) {
  //
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [smallImage,setSmallImage] = useState(null);
  const [acceptImage, setAcceptImage] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
      }
    });
  }, [user]);

  return (
    <div>
      <FadeIn>
        <TitleCard
          setReference={props.setReference}
          reference={props.reference}
          item={props.item}
          setUpload={props.setUpload}
          upload={props.upload}
        ></TitleCard>
        
        <UploadCard
          image={image}
          setImage={setImage}
          setSmallImage={setSmallImage}
          setAcceptImage={setAcceptImage}
        />
        <SubmitCard
          image={image}
          smallImage={smallImage}
          user={user}
          item={props.item}
          setImage={setImage}
          acceptImage={acceptImage}
          setSelected={props.setSelected}
        ></SubmitCard>
      </FadeIn>
    </div>
  );
}

export default Upload;
