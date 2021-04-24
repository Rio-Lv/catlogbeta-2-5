import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";

const Box = styled.div`
  display: flex;
  flex-direction: horizontal;
  position: fixed;
  left: 50%;
  top: 100px;
  transform: translate(-50%, 0);
  width: auto;
  height: auto;
  color: white;
  
  border: 3px solid red;
  @media (max-width: 800px) {
    top: 90px;
    width: 70%;
    flex-direction: column;
  }
`;
const InnerBox = styled.div`
  position: static;
  width: 300px;
  height: 300px;
  border: 3px solid blue;
  margin: 10px;
  @media (max-width: 800px) {
    flex-direction: column;
    width: auto;
    height: auto;
    margin: 0px;
  }
`;
const Title = styled.div`
font-size: 30px;
  right: -3px;
  width: 100%;
  height: 50px;
  border: 3px solid black;
  text-align: center;
  position: fixed;
  transform: translate(0, -60px);
  line-height:50px;
  @media (max-width: 800px) {
    font-size:21px;
    transform: translate(0, -40px);
    height: 30px;
    line-height:30px; 
  }
`;
function VoteBox(props) {
  // props should return a string that can be referenced to the correct submissions
  const [title, setTitle] = useState("");
  const [left, setLeft] = useState(null);
  const [leftUrl, setLeftUrl] = useState("");

  const [right, setRight] = useState("");
  const [rightUrl, setRightUrl] = useState("");

  useEffect(() => {
    if (props.left !== "") {
      db.doc(props.left).onSnapshot((doc) => {
        console.log('docRead')
        if (doc.exists) {
        //   console.log(doc.data());
          setTitle(doc.data().title);

          setLeftUrl(doc.data().urlSmall);
          setLeft(doc.data());

          if (props.right !== "") {
            db.doc(props.right).onSnapshot((doc) => {
              if (doc.exists) {
                console.log('docRead')
                // console.log(doc.data());

                setRightUrl(doc.data().urlSmall);
                setRight(doc.data());
              }
            });
          } else {
            // console.log("right is still empty");
          }
        }
      });
    } else {
    //   console.log("left is still empty");
      props.shuffle();
    }
  }, [props]);

  return (
    <div>
      <Box>
        <Title>{title}</Title>
        <InnerBox>
          <img
            style={{ position: "relative", width: "100%" }}
            src={leftUrl}
            alt=""
            onClick={() => {
              props.shuffle();
            }}
          />
        </InnerBox>
        <InnerBox>
          <img
            style={{ position: "relative", width: "100%" }}
            src={rightUrl}
            alt=""
            onClick={() => {
              props.shuffle();
            }}
          />
        </InnerBox>
      </Box>
    </div>
  );
}

export default VoteBox;
