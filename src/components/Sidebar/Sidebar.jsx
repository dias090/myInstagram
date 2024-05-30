import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

import { handleLogout } from "../../functions/handleLogout";

import TextLogoWhite from "../../assets/text-logo-white.svg";
import TextLogoDark from "../../assets/text-logo-dark.svg";
import InstagramLogoDark from "../../assets/instagram-logo-dark.svg";
import InstagramLogoWhite from "../../assets/instagram-logo-white.svg";
import "./Sidebar.scss";

const Sidebar = ({
  darkTheme,
  changeTheme,
  setIsLoading,
  toggleAddCard,
  toggleSearch,
}) => {
  const [username, setUsername] = useState("");
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      const userDocRef = doc(db, "Users", userId);
      getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
            setUsername(doc.data().userName);
            setIsLoading(false);
          } else {
            console.log("No such document!");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
          setIsLoading(false);
        });
    }
    setIsLoading(false);
  }, [userId]);
  return (
    <div className="sidebar_main">
      <div className="sidebar_container">
        <div className="sidebar">
          <ul className="con">
            <li>
              <Link to="/" className="logo_text">
                <img
                  src={darkTheme ? TextLogoWhite : TextLogoDark}
                  alt="instagram"
                />

                <img
                  src={darkTheme ? InstagramLogoWhite : InstagramLogoDark}
                  alt="instagram"
                  className="mobile_logo"
                />
              </Link>
            </li>
            <li>
              <Link to="/" className="button">
                <i className="material-icons left">home</i>
                Home
              </Link>
            </li>
            <li>
              <div className="button" onClick={toggleSearch}>
                <i className="material-icons left">search</i>
                search
              </div>
            </li>
            <li>
              <div className="button" onClick={toggleAddCard}>
                <i className="material-icons left">add_box</i>
                post
              </div>
            </li>
            <li>
              <Link
                to={`/profile/${auth.currentUser?.displayName || username}`}
                className="button"
              >
                <i className="material-icons left">person</i>
                profile
              </Link>
            </li>
          </ul>
          <ul className="con">
            <li>
              <div onClick={changeTheme} className="button">
                <i className="material-icons left">
                  {darkTheme ? "brightness_5" : "dark_mode"}{" "}
                </i>
                change the theme
              </div>
            </li>
            <li>
              <div onClick={() => handleLogout(auth)} className="button">
                <i className="material-icons left">logout</i>
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
