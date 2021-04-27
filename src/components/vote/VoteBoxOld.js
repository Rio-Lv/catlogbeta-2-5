import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import { blue } from "@material-ui/core/colors";
import { db } from "../../firebase";
import firebase from "firebase";

const Img = styled.img`
  opacity: 0;

  @media (max-width: 600px) {
    height: ${window.innerHeight * 0.4}px;
  }
`;
const BackBox = styled.div`
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 70px;
  display: flex;
  flex-direction: column;
  /* background-color: #6d6d6d; */
  overflow: scroll;
  @media (max-width: 600px) {
    display: block;
    height: 98%;
    width: 99%;
    top: 65px;
    transform: translate(-50%, -3%);
    border: 2px solid #000000;
    border-radius: 5px;
    transition: 1s ease;
  }
`;
const BackBoxShade = styled.div`
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 70px;
  display: flex;
  flex-direction: column;
  /* background-color: #6d6d6d; */
  overflow: scroll;
  background-color: black;
  opacity: 30%;
  @media (max-width: 600px) {
    display: block;
    height: 98%;
    width: 99%;
    top: 65px;
    transform: translate(-50%, -3%);
    border: 2px solid #000000;
    border-radius: 5px;
    transition: 1s ease;
  }
`;
const Box = styled.div`
  display: flex;
  flex-direction: horizontal;
  position: fixed;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -0%);
  width: ${1000}px;
  height: 0px;
  /* border :2px solid red; */
  color: white;
  transition: 1s ease;

  /* border: 3px solid red; */
  @media (max-width: 800px) {
    transform: translate(-48%, -65%);
    width: ${window.innerHeight * 0.4}px;
    flex-direction: column;
  }
`;

const Title = styled.div`
  position: fixed;
  font-size: 30px;
  right: px;
  width: 99.4%;
  height: 50px;
  border: 3px solid #131313;
  background-color: #1a1a1a;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  position: fixed;
  transform: translate(0, -55px);
  line-height: 50px;
  transition: 0.3s ease;
  @media (max-width: 800px) {
    width: 100%;
    position: static;
    font-size: 21px;
    transform: translate(-0px, 0px);
    height: 42px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    line-height: 37px;
  }
  &:hover {
    color: #99c9ff;
  }
`;
const InnerBox = styled.div`
  align-items: center;
  position: relative;
  width: 100%;
  height: 69%;
  background-color: #000000;
  border: 3px solid #131313;
  left: 0px;
  transition: 1s ease;

  @media (max-width: 800px) {
    margin-bottom: 70px;
    height: 0px;
    margin: 0px;
    transition: 1s ease;
  }
  &:hover {
    border-radius: 5px;
    border: 3px solid #0077ff;
  }
`;
const increment = firebase.firestore.FieldValue.increment(1);

const voteFunction = (WinPath, LossPath) => {
  db.doc(WinPath).set({ wins: increment },{merge:true});
  db.doc(LossPath).set({ losses: increment },{merge:true});
};

function VoteBoxOld(props) {
  // props should return a string that can be referenced to the correct submissions
  const [title, setTitle] = useState("");

  const [left, setLeft] = useState(null);
  const [leftUrl, setLeftUrl] = useState("");
  const [leftName, setLeftName] = useState("");

  const [right, setRight] = useState("");
  const [rightUrl, setRightUrl] = useState("");
  const [rightName, setRightName] = useState("");

  // loading in the vote component
  useEffect(() => {
    document.getElementById("right").style.transition = ".3s ease";
    document.getElementById("left").style.transition = ".3s ease";
    document.getElementById("box").style.top = "50%";
    //different action for mobile
    if (window.innerWidth > 800) {
      setTimeout(() => {
        document.getElementById("box").style.height = "74%";
      }, 900);
      document.getElementById("box").style.width = `${1000}px`;
      document.getElementById("box").style.transform = "translate(-50%, -35%)";
      setTimeout(() => {
        document.getElementById("right").style.opacity = "1";
        document.getElementById("left").style.opacity = "1";
      }, 2000);
    } else {
      document.getElementById("box").style.height = "74%";
      document.getElementById("box").style.transition = `1s`;
      document.getElementById("box").style.transform = `translate(-48%, -60%)`;
      document.getElementById("box").style.width = `${
        window.innerHeight * 0.4
      }px`;
      setTimeout(() => {
        document.getElementById("box").style.transform =
          "translate(-48%, -64%)";
        document.getElementById("leftBox").style.height = `${
          window.innerHeight * 0.44
        }px`;
        document.getElementById("rightBox").style.height = `${
          window.innerHeight * 0.44
        }px`;
        setTimeout(() => {
          document.getElementById("right").style.opacity = "1";
          document.getElementById("left").style.opacity = "1";
        }, 900);
      }, 800);
    }
  }, []);

  const fadeLeft = () => {
    document.getElementById("right").style.transition = ".3s";
    document.getElementById("right").style.opacity = 0;
    setTimeout(() => {
      document.getElementById("left").style.transition = " .6s";
      document.getElementById("left").style.opacity = 0;

      setTimeout(() => {
        props.shuffle();
      }, 520);
      setTimeout(() => {
        document.getElementById("left").style.transition = "0.5s";
        document.getElementById("right").style.transition = " 0.5s";
        document.getElementById("left").style.opacity = 1;
        document.getElementById("right").style.opacity = 1;
      }, 800);
    }, 200);
  };

  const fadeRight = () => {
    console.log("fadeRight");
    // document.getElementById("left").style.transition = ".3s";
    document.getElementById("left").style.opacity = 0;
    console.log("setting opacity to zero on the left, fadeRight function");
    console.log(document.getElementById("left").style.opacity);
    setTimeout(() => {
      document.getElementById("right").style.transition = " .6s";
      document.getElementById("right").style.opacity = 0;

      setTimeout(() => {
        props.shuffle();
      }, 500);
      setTimeout(() => {
        document.getElementById("right").style.transition = "0.5s";
        // document.getElementById("left").style.transition = " 0.5s";
        document.getElementById("right").style.opacity = 1;
        document.getElementById("left").style.opacity = 1;
      }, 800);
    }, 200);
  };
  const checkRight = () => {
    console.log("checkright");
    document.getElementById("rightCheck").style.transition = ".3s";
    document.getElementById("rightCheck").style.display = "inline";
    document.getElementById("rightCheck").style.opacity = "1";

    setTimeout(() => {
      document.getElementById("rightCheck").style.opacity = "0";

      setTimeout(() => {
        document.getElementById("rightCheck").style.display = "none";
      }, 500);
    }, 500);
  };
  const checkLeft = () => {
    console.log("checkright");
    document.getElementById("leftCheck").style.transition = ".3s";
    document.getElementById("leftCheck").style.display = "inline";
    document.getElementById("leftCheck").style.opacity = "1";

    setTimeout(() => {
      document.getElementById("leftCheck").style.opacity = "0";

      setTimeout(() => {
        document.getElementById("leftCheck").style.display = "none";
      }, 500);
    }, 500);
  };

  useEffect(() => {
    // console.log('running hook on vote props change')
    if (props.LeftPath !== "") {
      db.doc(props.LeftPath).onSnapshot((doc) => {
        // console.log('docRead')
        props.increaseDocRead();
        if (doc.exists) {
          //   console.log(doc.data());
          setTitle(doc.data().title);

          setLeftUrl(doc.data().urlSmall);
          setLeft(doc.data());
          setLeftName(doc.data().displayName);

          if (props.RightPath !== "") {
            db.doc(props.RightPath).onSnapshot((doc) => {
              if (doc.exists) {
                props.increaseDocRead();
                // console.log('docRead')
                // console.log(doc.data());
                setRightUrl(doc.data().urlSmall);
                setRight(doc.data());
                setRightName(doc.data().displayName);
              }
            });
          } else {
            // console.log("right is still empty");
          }
        }
      });
    } else {
      //console.log("left is still empty");
      props.shuffle();
    }
  }, [props.RightPath]);

  return (
    <div>
      {window.innerWidth < 700 ? (
        <div>
          <BackBoxShade />
          <BackBox>
            <Box id="box">
              <InnerBox
                id="leftBox"
                style={{
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                }}
              >
                {/* {leftName} */}

                <Img
                  id="left"
                  style={{
                    width: "100%",
                    position: "relative",
                    borderRadius: "2px",
                  }}
                  src={leftUrl}
                  alt=""
                  onClick={() => {
                    voteFunction(props.LeftPath, props.RightPath);
                    fadeLeft();
                    checkLeft();
                  }}
                />
                <CheckIcon
                  id="leftCheck"
                  style={{
                    display: "none",
                    position: "fixed",
                    fontSize: 200,

                    left: "50%",
                    transform: "translate(-50%,34%)",
                    color: blue[400],
                  }}
                ></CheckIcon>
              </InnerBox>
              <Title id="title">{title}</Title>
              <InnerBox
                id="rightBox"
                style={{
                  borderBottomRightRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                {/* {rightName} */}

                <Img
                  id="right"
                  style={{
                    width: "100%",
                    position: "relative",
                    borderRadius: "5px",
                  }}
                  src={rightUrl}
                  alt=""
                  onClick={() => {
                    console.log(left.title);
                    voteFunction(props.RightPath,props.LeftPath);
                    fadeRight();
                    checkRight();
                  }}
                />
                <CheckIcon
                  id="rightCheck"
                  style={{
                    display: "none",
                    position: "fixed",
                    fontSize: 200,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,81%)",
                    color: blue[400],
                  }}
                ></CheckIcon>
              </InnerBox>
            </Box>
          </BackBox>
        </div>
      ) : (
        //================================================= regular display above for mobile
        <Box id="box">
          <Title id="title">{title}</Title>
          <InnerBox
            style={{
              borderBottomLeftRadius: "10px",
            }}
          >
            <div>
              <Img
                id="left"
                style={{
                  width: "100%",
                  position: "relative",
                  borderRadius: "2px",
                }}
                src={leftUrl}
                alt=""
                onClick={() => {
                  voteFunction(props.LeftPath, props.RightPath);
                  fadeLeft();
                  checkLeft();
                }}
                onMouseEnter={() => {
                  document.getElementById("right").style.opacity = "0.35";
                }}
                onMouseLeave={() => {
                  document.getElementById("right").style.opacity = "1";
                }}
              />
              <CheckIcon
                id="leftCheck"
                style={{
                  opacity: "0",
                  position: "fixed",
                  fontSize: 250,
                  top: "50%",
                  transform: "translate(-145%,-95%)",
                  color: blue[400],
                }}
              ></CheckIcon>
            </div>
          </InnerBox>
          {/* Right image below ========================================= */}
          <InnerBox
            style={{
              borderBottomRightRadius: "10px",
              // border: "3px solid red",
            }}
          >
            {/* {rightName} */}
            <div
              onClick={() => {
                console.log("div Clicked ");
                fadeRight();
                checkRight();
                voteFunction(props.RightPath, props.LeftPath);
              }}
            >
              <Img
                id="right"
                style={{
                  width: "100%",
                  position: "relative",
                  borderRadius: "2px",
                }}
                src={rightUrl}
                alt=""
                onMouseEnter={() => {
                  document.getElementById("left").style.opacity = "0.35";
                }}
                onMouseLeave={() => {
                  document.getElementById("left").style.opacity = "1";
                }}
              />
              <CheckIcon
                id="rightCheck"
                style={{
                  opacity: "0",
                  position: "fixed",
                  fontSize: 250,
                  top: "50%",
                  transform: "translate(-145%,-95%)",
                  color: blue[400],
                }}
              ></CheckIcon>
            </div>
          </InnerBox>
        </Box>
      )}
    </div>
  );
}

export default VoteBoxOld;
