import React, { useEffect, useState } from "react";
import CheckIcon from "@material-ui/icons/Check";
import styled from "styled-components";
import { db } from "../../firebase";
import { blue } from "@material-ui/core/colors";
const Glass = styled.div`
  opacity: 0.5;
  width: 400px;
  height: 400px;
  background-color: black;
  border: 3px solid transparent;

  border-radius: 5px;
  transition: 0.3s ease;
  &:hover {
    opacity: 0;
  }
  @media (max-width: 800px) {
    opacity: 0;
    width: ${window.innerHeight * 0.4}px;
    height: ${window.innerHeight * 0.4}px;
  }
`;

const Frame = styled.div`
  opacity: 1;
  width: 400px;
  height: 400px;
  background-color: #363636;
  background-size: contain;
  border: 3px solid #1a1a1a;
  margin: 4px;
  border-radius: 5px;
  transition: 0.3s ease;
  @media (max-width: 800px) {
    width: ${window.innerHeight * 0.4}px;
    height: ${window.innerHeight * 0.4}px;
    margin: 5px;
  }
  &:hover {
    border: 3px solid #0077e7;
    opacity: 1;
  }
`;

function ImageBox(props) {
  const [path, setPath] = useState("");
  const [url, setUrl] = useState("");
  const [check, setCheck] = useState(0);
  const [tint, setTint] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    console.log(props.path);
    setPath(props.path);
  }, [props.path]);

  // function when the submission path changes // on shuffle
  useEffect(() => {
    var timerA = 500;
    var timerB = 500;
    if (isClicked) {
      timerA = 600;
      timerB = 400;
    } else {
      setTint(1);
    }
    setTimeout(() => {
      setTint(1);
      if (path !== "") {
        //   console.log(path);
        db.doc(path)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log(doc.data());
              try {
                // once url is set, wait for load before
                setUrl(doc.data().url);
                setTimeout(() => {
                  setTint(0);
                  setIsClicked(false);
                }, timerB);
              } catch (err) {
                console.log(err);
              }
            }
          });
      } else {
        console.log("incorrect path format");
      }
    }, timerA);
  }, [path]);

  // hide display while image changes

  const checkfunc = () => {
    setCheck(1);
    setTimeout(() => {
      setCheck(0);
    }, 700);
  };

  return (
    <div>
      <Frame
        className="frame"
        style={{
          backgroundImage: `url(${url})`,
        }}
      >
        <CheckIcon
          style={{
            opacity: `${check}`,
            transition: ".3s",
            position: "relative",
            fontSize: 200,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            color: blue[400],
          }}
        ></CheckIcon>
        <Glass
          style={{
            opacity: `${tint}`,
            position: "relative",
            transform: "translate(-3px,-207px)",
          }}
          onMouseLeave = {()=>{
              setTint(.5)
          }}
          onMouseEnter = {()=>{
              setTint(0)
          }}
          onClick={() => {
            checkfunc();
            setIsClicked(true);

            props.shuffle();
          }}
        ></Glass>
      </Frame>
    </div>
  );
}

export default ImageBox;
