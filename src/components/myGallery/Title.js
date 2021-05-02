import React, { useEffect } from "react";
import "./styles.css";
import styled from "styled-components";
import FadeIn from "react-fade-in";

const Top = styled.div`
  line-height: 70px;
  height: 70px;
  position: fixed;
  text-align: center;
  width: 100%;
  left: 50%;
  top: 100px;
  transform: translate(-50%, 0);
  font-size: 50px;
  font-family: "Great Vibes", cursive;
  border: 1px solid transparent;

  color: #f4faff;
  transition: 1s ease;

  background-color: #111111;
  border-radius: 3px;
  @media(max-width:700px){
    width:101%;
    top:40px
  }
 
`;

function Title() {
  useEffect(() => {
    const title = document.getElementById("PersonalGalleryTitle").style;
    setTimeout(() => {
      title.top = "0px";
      title.left = "";

      if (window.innerWidth > 700) {
        title.borderTopRightRadius = "0px";
        title.borderTopLeftRadius = "0px";
        title.borderBottomLeftRadius = "25px";
        title.borderBottomRightRadius = "25px";
        title.top = "-3px";
        title.width = "300px";
        title.height = "60px";
        title.fontSize = "40px";
        title.lineHeight = "65px";
        title.backgroundColor = "#fff8f2";
        title.color = "black";
        title.fontWeight = "800";
        setTimeout(()=>{
          title.border = "1px solid black"
        },1400)
        
      } else {
          title.width = "1000px"
        title.lineHeight = "48px";
        title.height = "42px";
        title.fontSize = "24px";
        title.left = "150px";
        
        title.fontWeight = "500";
        title.backgroundColor = "#1b1b1b";
        title.color = "#fff5f5f";
      }
    }, 1400);
  }, []);
  return (
    <div>
      <FadeIn>
        <Top id="PersonalGalleryTitle">
          <div>My Gallery</div>
        </Top>
      </FadeIn>
    </div>
  );
}

export default Title;
