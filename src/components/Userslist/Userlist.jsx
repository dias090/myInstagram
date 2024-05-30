import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { db, auth } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { handleLogout } from "../../functions/handleLogout";

import "./Userlist.scss";
import DefaultUser from "../../assets/defaultUser.svg";
import UserCard from "../UserCard/UserCard";

const UserList = ({ setIsLoading }) => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (currentUserId === null) return;

    const userDocRef = doc(db, "Users", currentUserId);
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setCurrentUserData(docSnap.data());
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
      });
    setIsLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId === null) return;

    const q = query(
      collection(db, "Users"),
      where("userId", "!=", currentUserId)
    );
    getDocs(q)
      .then((querySnapshot) => {
        const usersData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const following = data.followers?.includes(currentUserId);
          return {
            id: doc.id,
            avatar: data.avatar || DefaultUser,
            userName: data.userName,
            fullName: data.fullName,
            following,
          };
        });
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  }, [currentUserId]);

  return (
    <div>
      <div className="userlist_container">
        {currentUserData ? (
          <div>
            <Link
              to={`/profile/${auth.currentUser?.displayName}`}
              className="user_card"
            >
              <div className="user_card_element">
                <div className="avatar_con">
                  <img
                    src={currentUserData.avatar || DefaultUser}
                    alt="avatar"
                    className="user_avatar"
                  />
                </div>
                <div className="username_con">
                  <p>{currentUserData.userName}</p>
                  <p>{currentUserData.fullName}</p>
                </div>
              </div>
              <div className="user_card_element">
                <p
                  className="button red-text lighten-1"
                  onClick={() => handleLogout(auth)}
                >
                  Logout
                </p>
              </div>
            </Link>
            <hr />
            <>
              {users.map((user) => (
                <UserCard key={user.id} user={user} setUsers={setUsers} />
              ))}
            </>
          </div>
        ) : (
          <div>loading</div>
        )}
      </div>
    </div>
  );
};

export default UserList;
