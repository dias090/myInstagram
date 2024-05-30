import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./UsersComments.scss";
import { Link } from "react-router-dom";
import DefaultAvatar from "../../assets/defaultUser.svg"

const UsersComments = ({ userId, comment }) => {
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.userName);
          setUserAvatar(userData.avatar);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="users-comments_container">
      <div className="author_con">
        <Link to={`/profile/${username}`} className="img_con">
          <img
            src={userAvatar || DefaultAvatar}
            alt={`${username}'s avatar`}
            className="user-avatar"
          />
        </Link>
        <div>
          <Link to={`/profile/${username}`} className="username black-text ">{username}</Link>
          <p className="users_comment">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersComments;
