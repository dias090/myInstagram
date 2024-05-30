import React, { useState, useEffect, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth, db } from "./firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "materialize-css/dist/css/materialize.min.css";
import "./App.scss";

import { Signin, Signup, Mainpage } from "./components/routes";
import Loading from "./components/Loading/Loading";
import Profile from "./components/Profile/Profile";

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [isAuth, setisAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [addCard, setAddCard] = useState(false);
  const [search, setSearch] = useState(false);
  const [comments, setComments] = useState({});

  const toggleComments = (postId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: !prevComments[postId],
    }));
  };

  const toggleSearch = () => {
    setSearch(!search);
  };

  const toggleAddCard = () => {
    setAddCard(!addCard);
  };

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setDarkTheme(userData.darkTheme);
      } else {
        console.log("User document does not exist.");
      }
    } catch (error) {
      console.log(error.message);
    } 
  };

  useEffect(() => {
    if (currentUserId === null) return;

    fetchUserData(currentUserId);
  }, [currentUserId, fetchUserData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(true);
      if (user) {
        setCurrentUserId(user.uid);
        setisAuth(true);
        setIsLoading(false);
      } else {
        setCurrentUserId(null);
        setisAuth(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const changeTheme = async () => {
    const userId = auth.currentUser?.uid;
    
    if (userId) {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, "Users", userId);
        await setDoc(userDocRef, { darkTheme: !darkTheme }, { merge: true });
        setDarkTheme(!darkTheme);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        alert(`An error occurred: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/" /> : <Signin />}
      />
      <Route
        path="/signup"
        element={isAuth ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/"
        element={
          isAuth ? (
            <Mainpage
              darkTheme={darkTheme}
              changeTheme={changeTheme}
              setIsLoading={setIsLoading}
              addCard={addCard}
              toggleAddCard={toggleAddCard}
              search={search}
              toggleSearch={toggleSearch}
              comments={comments}
              toggleComments={toggleComments}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile/:username"
        element={
          isAuth ? (
            <Profile
              darkTheme={darkTheme}
              changeTheme={changeTheme}
              setIsLoading={setIsLoading}
              addCard={addCard}
              toggleAddCard={toggleAddCard}
              search={search}
              toggleSearch={toggleSearch}
              comments={comments}
              toggleComments={toggleComments}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
