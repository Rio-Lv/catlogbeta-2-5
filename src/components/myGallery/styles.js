import styled from "styled-components";
const Box = styled.div`
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 70px;
  display: flex;
  flex-direction: column;
  border: 2px solid #333333;
  border-radius: 10px;
  /* background-color: #6d6d6d; */
  opacity: 100%;
 
  overflow: scroll;
  @media (max-width: 600px) {
    width: auto;
    top: 65px;
  }
`;

const Row = styled.div`
  position: static;
  width: auto;
  align-self: center;
  display: flex;
  /* border: 3px solid blue; */
  margin-right: 10px;

  transform: translate(1%, 0);

  @media (max-width: 600px) {
    width: auto;
    flex-direction: column;
    /* position: relative; */
    transform: translate(3.3%, 0);
  }
`;

export {Box,Row}