import React,{useState,useEffect} from 'react'
import {db} from '../../firebase'

function Gallery(props) {
    const [references, setReferences] = useState([]);
    useEffect(() => {
        db.collection("users")
          .doc(props.user.uid)
          .onSnapshot((snap) => {
            if (snap.exists) {
              console.log(snap.data());
              setReferences(snap.data().references);
    
              references.forEach((reference) => {
                var current;
                reference.get().then((doc) => {
                  if (doc.exists) {
                    //console.log('getting doc from reference list in users')
                    console.log(doc.data());
                    current = doc.data();
                  } else {
                    console.log("doc not found");
                  }
                });
    
                console.log(current);
              });
            }
    
          });
      }, []);
    return (
        <div>
            Hello
        </div>
    )
}

export default Gallery
