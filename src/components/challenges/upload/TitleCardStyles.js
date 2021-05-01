import styled from "styled-components";
import "./styles.css";
// this 60 is the top:.. value from challenges.js
const Height = ((window.innerHeight - 60) / 7) * 0.75;
const ogHeight = 85;
const fontsize = 16;
const iconDiameter = 50;
// Progress Box this can control the circle size
const Pbox = styled.div`
  padding-top: 16px;
  padding-left: 30px;
  padding-right: 30px;
  width: ${iconDiameter}px;
  /* border: 1px solid black; */
  vertical-align: center;
  @media (max-width: 600px) {
    padding-top: ${(Height - iconDiameter - 7) / 2}px;
    padding-left: 0px;
    padding-right: 3px;
  }
`;
// Text box
const Tbox = styled.div`
  font-family: "Montserrat", sans-serif;
  left: 50px;
  color: #ffffff;
  padding-top: ${(ogHeight - fontsize - 9) / 2}px;
  text-transform: uppercase;
  padding-left: 15px;
  text-align: center;

  font-size: ${fontsize}px;

  vertical-align: center;
  transition: 0.7s ease;
  /* border:1px black solid; */
  @media (max-width: 600px) {
    padding-top: ${(Height - fontsize - 10) / 2}px;
  }
`;
//complete? text
const Tbox2 = styled.div`
  right: 20px;
  font-size: 20px;
  padding-top: ${(ogHeight - fontsize) / 2}px;
  position: fixed;
  align-self: right;
  color: #ffffff;

  text-transform: uppercase;
  padding-left: 15px;
  text-align: center;
  font-family: Verdana, sans-serif;
  font-weight: 500;
  vertical-align: center;
  transition: 0.3s ease;
  /* border:1px black solid; */
  @media (max-width: 600px) {
    padding-top: ${(Height - fontsize) / 2}px;
  }
`;
const Card = styled.button`
  display: flex;
  flex-direction: row;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #1a1a1a;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 85px;
  width: 100%;
  /* box-shadow:1px 1px 3px 2px; */
  border: 3px solid #2c2c2c;
  border-radius: 5px;
  vertical-align: center;
  transition: 1s ease;
  @media (max-width: 600px) {
    height: ${Height}px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  &:hover ${Tbox} {
  }
`;

export { Pbox, Tbox, Tbox2, Card };
