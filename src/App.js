import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import "./App.css";
import Challenges from "./components/challenges/Challenges";
import Gallery from "./components/gallery/Gallery";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import MyGallery from "./components/myGallery/MyGallery";
import Vote from "./components/vote/Vote";
import MainMenu from "./components/mainMenu/MainMenu";
import Backdrop from "./components/backdrop/Backdrop";

function App() {
  // authentification
  const [user, setUser] = useState(null);
  const [display, setDisplay] = useState(null);
  const [selected, setSelected] = useState("home");

  const menuItems = [
    {
      name: "home",
      component: <Home setSelected={setSelected} />,
      type: "public",
    },
    {
      name: "gallery",
      component: <Gallery setSelected={setSelected} />,
      type: "public",
    },
    {
      name: "My Gallery",
      component: <MyGallery setSelected={setSelected} user={user}/>,
      type: "account",
    },
    {
      name: "Challenges",
      component: <Challenges setSelected={setSelected} />,
      type: "account",
    },
    {
      name: "Vote",
      component: <Vote setSelected={setSelected} />,
      type: "account",
    },
  ];

  useEffect(() => {
    // check auth state changed
    auth.onAuthStateChanged((response) => {
      if (response) {
        setUser(response);
        if (user) {
          console.log("from authStateChange in app.js");
          console.log(user.uid);
        }
      } else {
        console.log("auth function no response");
        setUser(null);
      }
    });
  }, [user]);

  // component selection
  useEffect(() => {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].name === selected) {
        setDisplay(menuItems[i].component);
        console.log(selected);
      }
    }
  }, [selected]);

  return (
    <div className="App">
      <Backdrop
        setSelected={setSelected}
        selected={selected}
        onClick={() => {
          setSelected("home");
        }}
      />
      <MainMenu setSelected={setSelected} menuItems={menuItems} user={user} />
      <Login setSelected={setSelected} />

      {display}
    </div>
  );
}

export default App;
