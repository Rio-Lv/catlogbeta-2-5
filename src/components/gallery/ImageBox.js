import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";

const Frame = styled.div`
  width: 300px;
  height: 300px;
  background-color: black;
  border: 3px solid #000000;
  margin: 3px;
  background-size: contain;
  border-radius: 2px;
  transition:.3s ease;
  &:hover{
    border: 3px solid #44abff;
  }
  @media(max-width:800px){
    width: ${window.innerWidth-25}px;
    height: ${window.innerWidth-25}px;
    
    transform: translate(${0}px, 0%);
  }
`;
const Name = styled.div`
  width: 60%;
  padding-left: 20px;
  height: 30px;
  text-align: left;

  font-size: 20px;
  position: relative;
  color: white;
  background-color: black;
  top: 100%;
  transform: translate(0%, -100%);
  line-height: 27px;
  border-top-right-radius:25px;
`;

function ImageBox(props) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (props.reference !== "") {
      db.doc(props.reference)
        .get()
        .then((doc) => {
          console.log(doc.data());
          setUrl(doc.data().urlSmall);
          setName(doc.data().displayName);
        });
    }
  }, [props.reference]);
  return (
    <div>
      <Frame style={{ backgroundImage: `url(${url})` }}>
        <Name>{name}</Name>
      </Frame>
    </div>
  );
}

export default ImageBox;
