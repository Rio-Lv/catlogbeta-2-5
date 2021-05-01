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

  color: #f4faff;
  transition: 1s ease;

  background-color: #111111;
  border-radius: 3px;
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
        title.borderBottomLeftRadius = "35px";
        title.borderBottomRightRadius = "35px";
        title.width = "400px";
        title.height = "60px";
        title.fontSize = "40px";
        title.lineHeight = "60px";
        title.backgroundColor = "#fff8f2";
        title.color = "black";
        title.fontWeight = "800";
      } else {
          title.width = "1000px"
        title.lineHeight = "48px";
        title.height = "40px";
        title.fontSize = "24px";
        title.left = "150px";

        title.fontWeight = "800";
        title.backgroundColor = "#fff8f2";
        title.color = "black";
      }
    }, 1200);
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
