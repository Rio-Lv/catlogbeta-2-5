import styled from "styled-components";

const Height = ((window.innerHeight - 60) / 7) * 0.7;
const Submit = styled.button`
  text-align: center;
  position: relative;
  font-size: 24px;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #1a1a1a;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 65px;
  width: 100%;
  /* box-shadow:1px 1px 3px 2px; */
  border: 3px solid #2c2c2c;
  border-radius: 5px;
  vertical-align: center;
  transition: 0.3s ease;
  @media (max-width: 600px) {
    height: ${Height}px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

export {Submit};