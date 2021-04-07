import { Translate } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {getRGB} from "./functions"

const imageWidth = 300;
const pad = 10;
const Box = styled.div`
  
  width: ${imageWidth}px;
  height: ${imageWidth}px;
  margin: ${pad}px;
  border: 3px solid red;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  @media (max-width: 600px) {
    position: static;
    transform: translate(1%, 0);
  }
`;

const Text = styled.div`
  background-color: #333333;
  position: relative;
  color: white;
  left: 0px;
  top: 250px;
  padding-bottom: 4px;
  font-size: 30px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
`;

// gets image from firestore reference

function ImageBox(props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    try {
      props.reference.get().then((doc) => {
        console.log("displaying from submissions Sub Image box");
        console.log(doc.data());
        setUrl(doc.data().url);
        setTitle(doc.data().title);
      });
    } catch (err) {
      console.log(err);
    }
  }, [props.reference]);
  return (
    <Box>
      <img
        style={{
          position: "fixed",
          width: `${imageWidth}px`,
          borderRadius: "10px",
        }}
        src={url}
        alt=""
      />

      <Text>{title}</Text>
    </Box>
  );
}

export default ImageBox;
