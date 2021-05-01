import React, { useState, useEffect } from "react";
import {db} from "../../firebase"
import Styled from "styled-components";

const Image = Styled.img`
  object-fit:contain;
  position: fixed;
  width:${window.innerWidth}px;
  height:${window.innerWidth}px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  transition:width height 1s ease;
  /* border:3px  solid blue; */
`;

function Backdrop(props) {
  const [size, setSize] = useState(window.innerWidth);
  const [url, setUrl] = useState("https://i.pinimg.com/originals/a8/57/57/a8575717e6163a5b978606448671dee9.png");

  useEffect(()=>{
    db.doc("Sync/Current").onSnapshot(doc=>{
      if(doc.exists){
        const cycle = doc.data().VoteCompletedCycle
        console.log(cycle)
        db.doc(`Winners/${cycle}`).get().then(document=>{
          if(document.exists){
            const path = document.data().top3paths[0]
            console.log(path)
            if(!path.includes("TemplateID"))
            db.doc(path).get().then(winner=>{
              if(winner.exists){
                const winnerURL = winner.data().url
                console.log(winnerURL)
                setUrl(winnerURL)
              }
            })
          }
        })
      }
    })
  },[])



  const sizeImage = () => {
    if (window.innerWidth > 600) {
      if (props.selected === "Home") {
        if (size !== window.innerWidth) {
          setSize(window.innerWidth);
          console.log("adjusting to width");
        } else {
          setSize(window.innerHeight);
          console.log("adjusting to Height");
        }
      } else {
        props.setSelected("Home");
      }
    } else {
      setSize(window.innerHeight);
    }
  };
  const BGblur = () => {
    document.getElementById("bgImage").style.transition = "0.5s";
    document.getElementById("bgImage").style.filter = "blur(10px)";
    document.getElementById("bgImage").style.opacity = "0.6";
  };
  const BGrmblur = () => {
    document.getElementById("bgImage").style.transition = ".5s";
    document.getElementById("bgImage").style.filter = "blur(0px)";
    document.getElementById("bgImage").style.opacity = "1";
  };
  useEffect(()=>{
    if(window.innerWidth>600 && window.innerWidth>window.innerHeight){
      setSize(window.innerWidth)
      console.log('innit landscape')
    }else{
      setSize(window.innerHeight)
      console.log('innit Portrait')
    }
  },[])

  useEffect(() => {
    if (props.selected === "" || props.selected === "Home") {
      BGrmblur();
    } else {
      BGblur();
    }
  },[props.selected]);

  useEffect(()=>{
    BGrmblur()
  },[props.user])

  useEffect(() => {
    if(window.innerWidth<600){
      setSize(window.innerHeight)
    }
    const imagestyle = document.getElementById("bgImage").style;
    imagestyle.transition = "1s ease";
    imagestyle.height = `${size}px`;
    imagestyle.width = `${size}px`;
    imagestyle.border = `2px solid tranparent`;
  }, [size]);

  return (
    <Image
      id="bgImage"
      onClick={() => {
        sizeImage();
        props.setSelected("Home")
        console.log("backdrop clicked")
      }}
      src={url}
      alt=""
    ></Image>
  );
}

export default Backdrop;
