import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth,db } from "../../routes/firebase"; 

import { Sidebar } from "../script";
import "./Homepage.scss";


const HomePage = () => {
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

    return (
        <div 
            className="Homepage-container" 
            data-theme={darkTheme ? "dark" : "white"}
        >
            <Sidebar />
        </div>
    )
}

export default HomePage;