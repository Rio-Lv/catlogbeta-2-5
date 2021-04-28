import React, { useState, useEffect } from "react";
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

  const url = "https://preview.redd.it/6zzr0x68ss911.png?width=960&crop=smart&auto=webp&s=6036a5090083eae9145ee614c1adc1494ce37df6";

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
