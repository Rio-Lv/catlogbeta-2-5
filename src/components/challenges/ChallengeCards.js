import React, { useState, useEffect } from "react";
import ChallengeCard from "./ChallengeCard";
// using this as a template to create from firestore
// const syncChallenges = [
//   { title: "cat on hat", timeleft: 0.95, cycle: 7 },
//   { title: "cloth sloth", timeleft: 0.75, cycle: 6 },
//   { title: "grass ball", timeleft: 0.6, cycle: 5 },
//   { title: "clay glove", timeleft: 0.45, cycle: 4 },
//   { title: "wall bat", timeleft: 0.3, cycle: 3 },
//   { title: "fat pillow", timeleft: 0.1, cycle: 2 },
//   { title: "power towerssds", timeleft: 0.0021, cycle: 1 },
// ];

function ChallengeCards(props) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const array = new Array(props.references.length);
    for (let i = 0; i < props.references.length; i++) {
      // console.log(props.references[i]);
      array[i] = (
        <ChallengeCard 
          setReference = {props.setReference}
          reference={props.references[i]}
        ></ChallengeCard>
      );
    }
    setCards(array);
  }, [props]);

  return <div>{cards}</div>;
}

export default ChallengeCards;
