import React, { useState, useEffect } from "react";
// import styled from "styled-components";
import FadeIn from "react-fade-in";
// import { getRGB, handleUpload } from "./upload/functions";
import TitleCard from "./TitleCard";
import UploadCard from "./upload/UploadCard";
import SubmitCard from "./upload/SubmitCard"

import firebase from "firebase";
// using for resizing to 1:1 ratio


function Upload(props) {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [acceptImage,setAcceptImage] = useState(false);

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
        <TitleCard item={props.item} func={props.setUpload}></TitleCard>
        <UploadCard image={image} setImage={setImage} setAcceptImage={setAcceptImage}/>
        <SubmitCard image={image} user = {user} item = {props.item} setImage = {props.setImage} acceptImage={acceptImage} setSelected ={props.setSelected}></SubmitCard>
      </FadeIn>
    </div>
  );
}

export default Upload;
