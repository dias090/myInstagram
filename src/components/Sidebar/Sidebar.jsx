import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth,db } from "../../routes/firebase"; // replace with the correct path to your Firebase configuration file

const Sidebar = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const userDocRef = doc(db, "Users", userId);

      const fetchUserData = async () => {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDarkTheme(userData.darkTheme);
        } else {
          console.log("User document does not exist.");
        }
      };

      fetchUserData();
    }
  }, [auth.currentUser?.uid]);
  const changeTheme = async () => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const userDocRef = doc(db, "Users", userId);

      await setDoc(userDocRef, { darkTheme: !darkTheme }, { merge: true });
      setDarkTheme(!darkTheme);
      window.location.reload();
    }
  };
    return (
        <div className="sidebar_container" data-theme={darkTheme ? "dark" : "white"}>
            <div className="sidebar">
                <button 
                    onClick={changeTheme} 
                    className={`btn ${darkTheme ? "white black-text" : "black"}`}
                >
                    {darkTheme ? "white" : "dark"}
                </button>

                </div>
        </div>
    )
}

export default Sidebar;