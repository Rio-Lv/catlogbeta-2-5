import styled from "styled-components";
const Box = styled.div`
  display:none;
  left: 50%;
  position: fixed;
  height: 95%;
  transform: translate(-50%, 0);
  top: 55px;
  display: flex;
  flex-direction: column;

  /* background-color: #6d6d6d; */
  opacity: 100%;

  overflow: scroll;
  @media (max-width: 600px) {
    height: 98%;
    width: 99%;
    top: 65px;
    transform: translate(-50%, -3%);
    /* border: 2px solid #000000; */
    border-radius: 5px;
    display:block;
  }
`;

const Row = styled.div`
  position: static;
  width: auto;
  align-self: center;
  display: flex;
  /* border: 3px solid blue; */
  margin-right: 10px;

  transform: translate(1.5%, 0);

  @media (max-width: 600px) {
    width: auto;
    flex-direction: column;
    /* position: relative; */
    transform: translate(3.3%, 0);
  }
`;

export { Box, Row };
