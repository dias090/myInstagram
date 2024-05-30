import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DefaultUser from "../../assets/defaultUser.svg";
import "./Search.scss";
import UserCard from "../UserCard/UserCard";

const Search = ({ search, toggleSearch }) =>  {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searching, setSearching] = useState("");

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

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleSearch = (e) => {
    setSearching(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searching)
  );

  return (
    <div>
      {search && (
        <div className="search_container requires-no-scroll">
          <div className="bg" onClick={toggleSearch}></div>
          <div className="search">
            <nav>
              <div className="nav-wrapper">
                <form>
                  <div className="input-field grey darken-2">
                    <input
                      id="search"
                      type="search"
                      required
                      onChange={handleSearch}
                    />
                    <label className="label-icon" htmlFor="search">
                      <i className="material-icons">search</i>
                    </label>
                    <i className="material-icons">close</i>
                  </div>
                </form>
              </div>
            </nav>
            <div className="con">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  setUsers={setUsers}
                  toggleSearch={toggleSearch}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
